import { ImageSourcePropType } from "react-native";
import { icons } from "@/constants/icons";

/**
 * Mapping of known keywords/aliases to bundled local icon assets
 */
const LOCAL_ICON_MAP: Record<string, ImageSourcePropType> = {
    spotify: icons.spotify,
    netflix: icons.netflix,
    notion: icons.notion,
    figma: icons.figma,
    adobe: icons.adobe,
    "creative cloud": icons.adobe,
    photoshop: icons.adobe,
    illustrator: icons.adobe,
    github: icons.github,
    claude: icons.claude,
    anthropic: icons.claude,
    canva: icons.canva,
    openai: icons.openai,
    chatgpt: icons.openai,
    gpt: icons.openai,
    dropbox: icons.dropbox,
    medium: icons.medium,
};

/**
 * Comprehensive mapping of subscription services to their brand domain & simple-icons slug
 */
const BRAND_MAP: Record<string, { domain: string; slug: string }> = {
    // Entertainment & Streaming
    netflix: { domain: "netflix.com", slug: "netflix" },
    spotify: { domain: "spotify.com", slug: "spotify" },
    "youtube premium": { domain: "youtube.com", slug: "youtube" },
    youtube: { domain: "youtube.com", slug: "youtube" },
    "disney+": { domain: "disneyplus.com", slug: "disneyplus" },
    disney: { domain: "disneyplus.com", slug: "disneyplus" },
    "disney plus": { domain: "disneyplus.com", slug: "disneyplus" },
    hulu: { domain: "hulu.com", slug: "hulu" },
    "amazon prime": { domain: "primevideo.com", slug: "amazonprime" },
    "prime video": { domain: "primevideo.com", slug: "amazonprime" },
    "apple tv": { domain: "tv.apple.com", slug: "appletv" },
    "apple tv+": { domain: "tv.apple.com", slug: "appletv" },
    "apple music": { domain: "music.apple.com", slug: "applemusic" },
    "apple one": { domain: "apple.com", slug: "apple" },
    apple: { domain: "apple.com", slug: "apple" },
    icloud: { domain: "icloud.com", slug: "icloud" },
    max: { domain: "max.com", slug: "hbo" },
    hbo: { domain: "max.com", slug: "hbo" },
    "hbo max": { domain: "max.com", slug: "hbo" },
    paramount: { domain: "paramountplus.com", slug: "paramountplus" },
    "paramount+": { domain: "paramountplus.com", slug: "paramountplus" },
    peacock: { domain: "peacocktv.com", slug: "peacock" },
    crunchyroll: { domain: "crunchyroll.com", slug: "crunchyroll" },
    twitch: { domain: "twitch.tv", slug: "twitch" },
    tidal: { domain: "tidal.com", slug: "tidal" },
    deezer: { domain: "deezer.com", slug: "deezer" },
    soundcloud: { domain: "soundcloud.com", slug: "soundcloud" },
    audible: { domain: "audible.com", slug: "audible" },

    // AI & ML Tools
    chatgpt: { domain: "openai.com", slug: "openai" },
    openai: { domain: "openai.com", slug: "openai" },
    claude: { domain: "claude.ai", slug: "claude" },
    anthropic: { domain: "anthropic.com", slug: "anthropic" },
    midjourney: { domain: "midjourney.com", slug: "midjourney" },
    copilot: { domain: "github.com", slug: "githubcopilot" },
    "github copilot": { domain: "github.com", slug: "githubcopilot" },
    cursor: { domain: "cursor.com", slug: "cursor" },
    perplexity: { domain: "perplexity.ai", slug: "perplexity" },
    gemini: { domain: "gemini.google.com", slug: "googlegemini" },
    runway: { domain: "runwayml.com", slug: "runway" },
    elevenlabs: { domain: "elevenlabs.io", slug: "elevenlabs" },
    v0: { domain: "v0.dev", slug: "vercel" },
    suno: { domain: "suno.com", slug: "suno" },
    jasper: { domain: "jasper.ai", slug: "jasper" },
    grammarly: { domain: "grammarly.com", slug: "grammarly" },

    // Developer & Cloud Tools
    github: { domain: "github.com", slug: "github" },
    gitlab: { domain: "gitlab.com", slug: "gitlab" },
    vercel: { domain: "vercel.com", slug: "vercel" },
    netlify: { domain: "netlify.com", slug: "netlify" },
    aws: { domain: "aws.amazon.com", slug: "amazonwebservices" },
    "amazon web services": { domain: "aws.amazon.com", slug: "amazonwebservices" },
    "google cloud": { domain: "cloud.google.com", slug: "googlecloud" },
    gcp: { domain: "cloud.google.com", slug: "googlecloud" },
    azure: { domain: "azure.microsoft.com", slug: "microsoftazure" },
    digitalocean: { domain: "digitalocean.com", slug: "digitalocean" },
    supabase: { domain: "supabase.com", slug: "supabase" },
    firebase: { domain: "firebase.google.com", slug: "firebase" },
    mongodb: { domain: "mongodb.com", slug: "mongodb" },
    "mongo atlas": { domain: "mongodb.com", slug: "mongodb" },
    planetscale: { domain: "planetscale.com", slug: "planetscale" },
    railway: { domain: "railway.app", slug: "railway" },
    render: { domain: "render.com", slug: "render" },
    docker: { domain: "docker.com", slug: "docker" },
    postman: { domain: "postman.com", slug: "postman" },
    sentry: { domain: "sentry.io", slug: "sentry" },
    datadog: { domain: "datadoghq.com", slug: "datadog" },
    cloudflare: { domain: "cloudflare.com", slug: "cloudflare" },
    heroku: { domain: "heroku.com", slug: "heroku" },
    jetbrains: { domain: "jetbrains.com", slug: "jetbrains" },
    linear: { domain: "linear.app", slug: "linear" },
    jira: { domain: "atlassian.com", slug: "jira" },
    confluence: { domain: "atlassian.com", slug: "confluence" },
    atlassian: { domain: "atlassian.com", slug: "atlassian" },

    // Design & Creative
    figma: { domain: "figma.com", slug: "figma" },
    canva: { domain: "canva.com", slug: "canva" },
    adobe: { domain: "adobe.com", slug: "adobe" },
    photoshop: { domain: "adobe.com", slug: "adobephotoshop" },
    illustrator: { domain: "adobe.com", slug: "adobeillustrator" },
    framer: { domain: "framer.com", slug: "framer" },
    sketch: { domain: "sketch.com", slug: "sketch" },
    invision: { domain: "invisionapp.com", slug: "invision" },
    dribbble: { domain: "dribbble.com", slug: "dribbble" },
    behance: { domain: "behance.net", slug: "behance" },
    spline: { domain: "spline.design", slug: "spline" },

    // Productivity & Office
    notion: { domain: "notion.so", slug: "notion" },
    slack: { domain: "slack.com", slug: "slack" },
    discord: { domain: "discord.com", slug: "discord" },
    zoom: { domain: "zoom.us", slug: "zoom" },
    "microsoft 365": { domain: "office.com", slug: "microsoftoffice" },
    office: { domain: "office.com", slug: "microsoftoffice" },
    microsoft: { domain: "microsoft.com", slug: "microsoft" },
    "google workspace": { domain: "workspace.google.com", slug: "google" },
    "google one": { domain: "one.google.com", slug: "google" },
    google: { domain: "google.com", slug: "google" },
    "google drive": { domain: "drive.google.com", slug: "googledrive" },
    dropbox: { domain: "dropbox.com", slug: "dropbox" },
    box: { domain: "box.com", slug: "box" },
    airtable: { domain: "airtable.com", slug: "airtable" },
    asana: { domain: "asana.com", slug: "asana" },
    monday: { domain: "monday.com", slug: "mondaydotcom" },
    "monday.com": { domain: "monday.com", slug: "mondaydotcom" },
    trello: { domain: "trello.com", slug: "trello" },
    clickup: { domain: "clickup.com", slug: "clickup" },
    todoist: { domain: "todoist.com", slug: "todoist" },
    evernote: { domain: "evernote.com", slug: "evernote" },
    obsidian: { domain: "obsidian.md", slug: "obsidian" },
    loom: { domain: "loom.com", slug: "loom" },
    miro: { domain: "miro.com", slug: "miro" },
    coda: { domain: "coda.io", slug: "coda" },

    // Security & Utilities
    "1password": { domain: "1password.com", slug: "1password" },
    bitwarden: { domain: "bitwarden.com", slug: "bitwarden" },
    lastpass: { domain: "lastpass.com", slug: "lastpass" },
    nordvpn: { domain: "nordvpn.com", slug: "nordvpn" },
    expressvpn: { domain: "expressvpn.com", slug: "expressvpn" },
    surfshark: { domain: "surfshark.com", slug: "surfshark" },
    proton: { domain: "proton.me", slug: "proton" },
    protonmail: { domain: "proton.me", slug: "protonmail" },
    protonvpn: { domain: "protonvpn.com", slug: "protonvpn" },

    // News & Reading
    medium: { domain: "medium.com", slug: "medium" },
    substack: { domain: "substack.com", slug: "substack" },
    nytimes: { domain: "nytimes.com", slug: "newyorktimes" },
    "new york times": { domain: "nytimes.com", slug: "newyorktimes" },
    wsj: { domain: "wsj.com", slug: "wallstreetjournal" },
    "wall street journal": { domain: "wsj.com", slug: "wallstreetjournal" },
    economist: { domain: "economist.com", slug: "theeconomist" },
    "the economist": { domain: "economist.com", slug: "theeconomist" },
    "the athletic": { domain: "theathletic.com", slug: "theathletic" },
    bloomberg: { domain: "bloomberg.com", slug: "bloomberg" },

    // Learning & Education
    coursera: { domain: "coursera.org", slug: "coursera" },
    udemy: { domain: "udemy.com", slug: "udemy" },
    skillshare: { domain: "skillshare.com", slug: "skillshare" },
    masterclass: { domain: "masterclass.com", slug: "masterclass" },
    duolingo: { domain: "duolingo.com", slug: "duolingo" },
    datacamp: { domain: "datacamp.com", slug: "datacamp" },
    leetcode: { domain: "leetcode.com", slug: "leetcode" },
    codecademy: { domain: "codecademy.com", slug: "codecademy" },
    pluralsight: { domain: "pluralsight.com", slug: "pluralsight" },

    // Gaming
    playstation: { domain: "playstation.com", slug: "playstation" },
    "playstation plus": { domain: "playstation.com", slug: "playstation" },
    "ps plus": { domain: "playstation.com", slug: "playstation" },
    xbox: { domain: "xbox.com", slug: "xbox" },
    "game pass": { domain: "xbox.com", slug: "xbox" },
    "xbox game pass": { domain: "xbox.com", slug: "xbox" },
    nintendo: { domain: "nintendo.com", slug: "nintendoswitch" },
    "nintendo switch online": { domain: "nintendo.com", slug: "nintendoswitch" },
    steam: { domain: "store.steampowered.com", slug: "steam" },
    geforce: { domain: "nvidia.com", slug: "nvidia" },
    "geforce now": { domain: "nvidia.com", slug: "nvidia" },
    ea: { domain: "ea.com", slug: "ea" },
    "ea play": { domain: "ea.com", slug: "ea" },

    // Social & Creator
    patreon: { domain: "patreon.com", slug: "patreon" },
    x: { domain: "x.com", slug: "x" },
    twitter: { domain: "x.com", slug: "x" },
    "x premium": { domain: "x.com", slug: "x" },
    linkedin: { domain: "linkedin.com", slug: "linkedin" },
    "linkedin premium": { domain: "linkedin.com", slug: "linkedin" },
    reddit: { domain: "reddit.com", slug: "reddit" },
    "reddit premium": { domain: "reddit.com", slug: "reddit" },
    strava: { domain: "strava.com", slug: "strava" },
};

/**
 * Returns a high-res favicon URL for any domain
 */
export const getFaviconUrl = (domain: string): string => {
    return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
};

/**
 * Resolves a subscription icon from the given subscription name.
 * 1. Matches bundled local asset icons first.
 * 2. Matches known brand list to return high-res brand icon.
 * 3. Fallbacks to domain-heuristic favicon or wallet icon.
 */
export const getSubscriptionIcon = (name: string): ImageSourcePropType => {
    if (!name || !name.trim()) {
        return icons.wallet;
    }

    const cleanName = name.trim().toLowerCase();

    // 1. Check direct local bundled icon match
    for (const [key, iconAsset] of Object.entries(LOCAL_ICON_MAP)) {
        if (cleanName.includes(key) || key.includes(cleanName)) {
            return iconAsset;
        }
    }

    // 2. Check brand map match
    for (const [key, brand] of Object.entries(BRAND_MAP)) {
        if (cleanName.includes(key) || key.includes(cleanName)) {
            return { uri: getFaviconUrl(brand.domain) };
        }
    }

    // 3. Heuristic: Check if user typed a domain name (e.g. "myco.io" or "app.com")
    if (cleanName.includes(".")) {
        const potentialDomain = cleanName.replace(/https?:\/\//, "").split("/")[0];
        return { uri: getFaviconUrl(potentialDomain) };
    }

    // 4. Default: generate domain from name (e.g. "zapier" -> "zapier.com")
    const simplifiedSlug = cleanName.replace(/[^a-z0-9]/g, "");
    if (simplifiedSlug.length > 1) {
        return { uri: getFaviconUrl(`${simplifiedSlug}.com`) };
    }

    return icons.wallet;
};
