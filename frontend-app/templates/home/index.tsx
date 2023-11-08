import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import {Spacer} from "@nextui-org/react";
import { Chart } from "@/components/charts/steam";

export default function HomePage() {
	return (
		<DefaultLayout>
			<section className="flex flex-col flex-wrap items-center justify-center gap-4 py-8 md:py-10">
				<div className="inline-block max-w-lg text-center justify-center">
					<h1 className={title()}>SEJA&nbsp;</h1>
					<h1 className={title({ color: "violet" })}>BEM-VINDO!&nbsp;</h1>
					<br />
					<h4 className={subtitle({ class: "mt-2" })}>
						Desenvolvido por Bruno Santos.
					</h4>
				</div>
				<Chart/>
			</section>
		</DefaultLayout>
	);
}
