-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR REVIEWFLOW AI
-- =========================================================
--
--
-- ---------------------------------------------------------
-- 1. ORGANIZATION MEMBERS TABLE
-- ---------------------------------------------------------
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members FORCE ROW LEVEL SECURITY;

CREATE POLICY member_isolation ON organization_members
    FOR ALL
    USING (organization_id = current_setting('app.organization_id',true))
    WITH CHECK (organization_id = current_setting('app.organization_id',true));

-- ---------------------------------------------------------
-- 2. DOCUMENTS TABLE
-- ---------------------------------------------------------
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

CREATE POLICY document_isolation ON documents
    FOR ALL
    USING (organization_id = current_setting('app.organization_id',true))
    WITH CHECK (organization_id = current_setting('app.organization_id',true));
