# Najla Portfolio

A public portfolio for Najla Nuricia Laudy, with private authoring tools for maintaining its content.

## Language

**Portfolio**:
Najla’s public site at `nacia.ryuko.my.id`, presenting her work, projects, and education.
_Avoid_: Website, site

**Authoring area**:
The private `/admin` section of the Portfolio used by Najla to manage content.
_Avoid_: CMS, admin panel, dashboard

**Content**:
Versioned MDX records stored in the Portfolio repository and published by a Cloudflare Worker deployment.
_Avoid_: Database records, remote CMS entries

**Author**:
A person permitted to use the Authoring area: `syahrul4w@gmail.com` or `najlalaudy@gmail.com`.
_Avoid_: Visitor, user

**Publishing commit**:
A content change recorded under the shared `najla-portfolio-bot` Git identity, with the acting Author identified in its message.
_Avoid_: Personal Git commit

**Publish**:
The explicit Author action that commits one content change and triggers deployment; unsaved form edits do not persist.
_Avoid_: Autosave, draft

**Content bundle**:
One content item’s MDX file and its local media, stored together at `src/content/<collection>/<slug>/`.
_Avoid_: Asset module, remote media record

## Portfolio Content

**Work**:
An employment, freelance, or creator engagement displayed as an experience record; it may be associated with Projects.
_Avoid_: Project, case study

**Project**:
A portfolio case study with an MDX detail page and masonry media gallery; it may be associated with zero or one Work record.
_Avoid_: Work, experience

**Education**:
A school or program credential displayed as a record without a public detail page.
_Avoid_: Course, project

**Published**:
A Content item eligible to appear on the public Portfolio; unpublished items remain available only in the Authoring area.
_Avoid_: Draft

**Gallery**:
A Project’s masonry media shown only on its detail page; the homepage uses its single cover image.
_Avoid_: Project card media

**Project navigation**:
Links from a Project detail page to its previous and next publicly visible Project in portfolio order.
_Avoid_: Browser history

**Portfolio order**:
The explicit ascending numeric position used to curate Content on public Portfolio sections.
_Avoid_: Newest first

**Portfolio theme**:
An editorial public presentation using the CuteSpringTheme palette with clean sans-serif typography.
_Avoid_: Admin dashboard layout

**Authoring theme**:
The full CuteSpringTheme component styling used in the Authoring area.
_Avoid_: Public portfolio theme

**Reduced motion**:
A visitor preference that disables Portfolio motion effects.
_Avoid_: Animation setting

**Hero**:
The Portfolio introduction with Najla’s name, roles, concise bio, and primary contact; a portrait may be added later.
_Avoid_: About page

**Portfolio settings**:
The one editable record holding Portfolio identity, contact links, and default SEO metadata.
_Avoid_: Hardcoded site metadata

**Project SEO**:
A Project’s required description and optional local social image; its cover image is the fallback social image.
_Avoid_: Generated description

**Portfolio language**:
English, the sole public and authoring language in the first release.
_Avoid_: Localized content

**Publish conflict**:
A Git source conflict returned when another Author changed the same Content; the Authoring area refreshes the latest version and requires the Author to reapply their edit.
_Avoid_: Silent overwrite

**Slug**:
A URL identifier generated from a Project title, editable only before its first Publish.
_Avoid_: Title URL

**Date range**:
An ISO start date and optional end date describing the duration of a Work, Project, or Education item.
_Avoid_: Display date

**Tool**:
A reusable software, technology, or skill record which Projects reference; it has frontmatter only and appears as a Project badge.
_Avoid_: Free-form tag

**Deletion**:
The confirmed removal of a Content item and its local Content bundle through a Publishing commit. Tool deletion is blocked while referenced; Work deletion clears its Project references; deleted Project URLs return 404.
_Avoid_: Unpublish
