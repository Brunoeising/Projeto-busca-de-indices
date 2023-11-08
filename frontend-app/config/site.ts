export type SiteConfig = typeof siteConfig;

export const statusOptions = [
	{name: "Active", uid: "active"},
	{name: "Paused", uid: "paused"},
	{name: "Vacation", uid: "vacation"},
  ];

export const siteConfig = {
	name: "AQUILA",
	description: "Make beautiful websites regardless of your design experience.",
	navItems: [
		{
			label: "Fontes",
			href: "/fontes",
		},
    {
      label: "User",
      href: "/users",
    },
	],
	
	links: {
		github: "https://github.com/nextui-org/nextui",
		twitter: "https://twitter.com/getnextui",
		docs: "https://nextui-docs-v2.vercel.app",
		discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev"
	},
};
