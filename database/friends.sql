-- Private transactional document store. Only the authenticated server gateway can call it.
create table public.gaon_friend_docs (
 key text primary key,
 version bigint not null default 1,
 data jsonb,
 updated_at timestamptz not null default now()
);
alter table public.gaon_friend_docs enable row level security;
revoke all on public.gaon_friend_docs from public, anon, authenticated;
grant all on public.gaon_friend_docs to service_role;
create function public.gaon_friends_read(p_keys text[]) returns jsonb
language sql security invoker set search_path = '' as $$
 select coalesce(jsonb_object_agg(key,jsonb_build_object('version',version,'data',data)),'{}'::jsonb)
 from public.gaon_friend_docs where key=any(p_keys);
$$;
create function public.gaon_friends_commit(p_expected jsonb,p_writes jsonb) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare k text; v bigint;
begin
 if jsonb_typeof(p_expected)<>'object' or jsonb_typeof(p_writes)<>'object' then raise exception 'invalid transaction'; end if;
 if (select count(*) from jsonb_object_keys(p_expected))>20 then raise exception 'too many keys'; end if;
 for k in select jsonb_object_keys(p_writes) loop
  if not p_expected ? k then raise exception 'missing expected version'; end if;
 end loop;
 for k in select jsonb_object_keys(p_expected) order by 1 loop
  perform pg_advisory_xact_lock(hashtextextended(k,91839));
 end loop;
 for k in select jsonb_object_keys(p_expected) loop
  select version into v from public.gaon_friend_docs where key=k;
  if coalesce(v,0)<>(p_expected->>k)::bigint then return false; end if;
 end loop;
 for k in select jsonb_object_keys(p_writes) loop
  insert into public.gaon_friend_docs(key,version,data) values(k,1,p_writes->k)
  on conflict(key) do update set version=gaon_friend_docs.version+1,data=excluded.data,updated_at=now();
 end loop;
 return true;
end;
$$;
revoke all on function public.gaon_friends_read(text[]) from public,anon,authenticated;
revoke all on function public.gaon_friends_commit(jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.gaon_friends_read(text[]) to service_role;
grant execute on function public.gaon_friends_commit(jsonb,jsonb) to service_role;
