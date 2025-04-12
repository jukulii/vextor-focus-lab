alter table "public"."sitemaps" add column "processed_urls_count" integer not null default 0;

alter table "public"."sitemaps" add column "urls_count" integer not null default 0;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_project()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- If the new project is of type sitemap_url, add it to sitemaps table
    IF NEW.source_type = 'sitemap_url' THEN
        INSERT INTO public.sitemaps (
            project_id,
            url,
            urls_count,
            processed_urls_count,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            NEW.name, -- since we store the sitemap URL in the name field
            0, -- default urls_count
            0, -- default processed_urls_count
            NEW.created_at,
            NEW.updated_at
        );
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_sitemap()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Enqueue sitemap processing task
    PERFORM util.enqueue_sitemap_processing(
        NEW.url,
        NEW.project_id,
        NEW.id
    );
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER handle_new_project_trigger AFTER INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_new_project();

CREATE TRIGGER on_sitemap_created AFTER INSERT ON public.sitemaps FOR EACH ROW EXECUTE FUNCTION handle_new_sitemap();


create type "util"."sitemap_task" as ("sitemap_url" text, "project_id" uuid, "sitemap_id" uuid, "created_at" timestamp with time zone);


