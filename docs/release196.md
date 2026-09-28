# Workshop scenery overlap 196

A fence was not classified as scenery, so the editor rejected fences overlapping the boundary wall or existing trees. Add fences to the shared scenery classification used by both client validation and the publishing API. No map object is moved or deleted; collision, actor access and exit checks remain active.

Verification: reproduce route4 wall79 + v41-fence at (0,1), including an existing conifer; validate the unchanged document successfully, retain blocked boundary collision, reject exit obstruction and furniture overlap. The user's unsaved browser document is not available through the connected browser inventory, so it has not been published by this code deployment.
