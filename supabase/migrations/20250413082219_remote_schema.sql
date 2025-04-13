drop trigger if exists "handle_new_project_trigger" on "public"."projects";

drop trigger if exists "on_sitemap_created" on "public"."sitemaps";

drop function if exists "public"."handle_new_project"();

drop function if exists "public"."handle_new_sitemap"();

alter table "public"."sitemaps" alter column "created_at" set not null;

alter table "public"."sitemaps" alter column "updated_at" set not null;


