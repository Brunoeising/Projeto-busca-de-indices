import { CapacityData } from "@/templates/indicadoresMovi/components/capacidade";
import { BacklogData } from "@/templates/indicadoresMovi/components/backlog/backlog";  // Certifique-se de que BacklogData é exportado deste arquivo
import { SVGProps } from "react";
import { TramitesData } from "@/templates/indicadoresMovi/components/tramites/tramites";


export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IndicatorsData {
  capacidade: CapacityData;
  backlog: BacklogData;
  tramites: TramitesData;
}

