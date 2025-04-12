-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
    -- If the new project is of type sitemap_url, add it to sitemaps table
    IF NEW.source_type = 'sitemap_url' THEN
        INSERT INTO public.sitemaps (
            project_id,
            url,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            NEW.name, -- since we store the sitemap URL in the name field
            NEW.created_at,
            NEW.updated_at
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that runs after INSERT on projects
CREATE TRIGGER handle_new_project_trigger
    AFTER INSERT ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_project();

-- Add comment to the function
COMMENT ON FUNCTION public.handle_new_project IS 'Automatically adds sitemap URL to sitemaps table when a project of type sitemap_url is created';
