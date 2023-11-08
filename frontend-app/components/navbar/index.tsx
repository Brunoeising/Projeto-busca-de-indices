import {
	Link,
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
	DropdownItem,
	Avatar,
	Dropdown,
	DropdownMenu,
	DropdownTrigger,
	DropdownSection,
	User,
	Button,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { link as linkStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import {GithubIcon} from "@/components/icons";
import { Logo } from "@/components/icons";
import { PlusIcon } from "@/templates/users/components/PlusIcon";
import router, { useRouter } from 'next/router';
import { SetStateAction, useState } from "react";
import {ChevronDown, Lock, Activity, Flash, Server, TagUser, Scale} from "./Icons.jsx";
import Image from 'next/image';



export const Navbar = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const [selectedTheme, setSelectedTheme] = useState("Claro");
  
	const handleSignOut = async () => {
	  await signOut({ redirect: false });
	  router.push('/'); // Redireciona para a página de autenticação
	};


	const icons = {
		chevron: <ChevronDown fill="currentColor" size={16} height={undefined} width={undefined} />,
		scale: <Scale className="text-warning" fill="currentColor" size={30} height={undefined} width={undefined} />,
		lock: <Lock className="text-success" fill="currentColor" size={30} height={undefined} width={undefined} />,
		activity: <Activity className="text-secondary" fill="currentColor" size={30} height={undefined} width={undefined} />,
		flash: <Flash className="text-primary" fill="currentColor" size={30} height={undefined} width={undefined} />,
		server: <Server className="text-success" fill="currentColor" size={30} height={undefined} width={undefined} />,
		user: <TagUser className="text-danger" fill="currentColor" size={30} height={undefined} width={undefined} />,
	  };

	return (
		<NextUINavbar maxWidth="full" position="sticky" className="ml-0 pl-0">
		<NavbarContent className="basis-1/5 sm:basis-full justify-start ml-0 pl-0">
			<NavbarBrand className="flex justify-start max-w-fit ml-0 pl-0">
				<NextLink className="flex items-center gap-1 ml-0 pl-0" href="/">
					<Image src="/logot.png" alt="logot" width={50} height={50} />
					<p className="font-bold text-inherit">AQUILA</p>
				</NextLink>
			</NavbarBrand>
		</NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
				
				<NavbarItem className="hidden md:flex">
				<Dropdown placement="bottom-end" showArrow
				radius="sm"
				backdrop="blur"
				classNames={{
					base: "p-0 border-small border-divider ",
					arrow: "bg-default-200",
				}}
				>
				<DropdownTrigger>
						{session?.user ? (
						<Avatar
							isBordered
							as="button"
							className="transition-transform"
							src={session.user.image ?? undefined}
						/>
						) : (
						<Avatar isBordered as="button" className="transition-transform" />
						)}
					</DropdownTrigger>
				<DropdownMenu
					disabledKeys={["profile"]}
					className="p-3"
					itemClasses={{
					base: [
						"rounded-md",
						"text-default-500",
						"transition-opacity",
						"data-[hover=true]:text-foreground",
						"data-[hover=true]:bg-default-100",
						"dark:data-[hover=true]:bg-default-50",
						"data-[pressed=true]:opacity-70",
						"data-[focus-visible=true]:ring-default-500",
					],
					}}
				>
					<DropdownSection aria-label="Profile & Actions" showDivider>
					<DropdownItem
						isReadOnly
						key="profile"
						className="opacity-100"
						>
						{session?.user ? (
							<User
							name={session.user.name}
							description={session.user.email}
							classNames={{
								name: "text-default-600",
								description: "text-default-500",
							}}
							avatarProps={{
								size: "sm",
								src: session.user.image ?? undefined,
							}}
							/>
						) : (
							"Not logged in"
						)}
						</DropdownItem>
					<DropdownItem key="dashboard">
						Dashboard
					</DropdownItem>
					<DropdownItem key="settings">Configurações</DropdownItem>
					</DropdownSection>

					<DropdownSection aria-label="Help & Feedback">
					<DropdownItem key="help_and_feedback">
						Ajuda
						</DropdownItem>
							<DropdownItem onClick={handleSignOut} key="logout">
						Desconectar
						</DropdownItem>
							</DropdownSection> 
						</DropdownMenu>
						</Dropdown>
							</NavbarItem>
						</NavbarContent>
						<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
					<ThemeSwitch />
				<NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
			
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{siteConfig.navItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								color={
									index === 2
										? "primary"
										: index === siteConfig.navItems.length - 1
										? "danger"
										: "foreground"
								}
								href="#"
								size="lg"
							>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
