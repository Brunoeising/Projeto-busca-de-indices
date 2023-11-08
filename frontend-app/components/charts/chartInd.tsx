
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
  } from "recharts";
  import {Card, Spacer, Button} from "@nextui-org/react";
  import React from "react";
  
  
  // dados mocados para remover depois
  const data = [
    {
      time: 1672833600,
      high: 13.73,
      low: 13.4,
      open: 13.63,
      volumefrom: 274840.98,
      volumeto: 3723854.18,
      close: 13.43,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672837200,
      high: 13.57,
      low: 13.42,
      open: 13.43,
      volumefrom: 159848.81,
      volumeto: 2157091.22,
      close: 13.48,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672840800,
      high: 13.51,
      low: 13.22,
      open: 13.48,
      volumefrom: 439961,
      volumeto: 5878201.22,
      close: 13.47,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672844400,
      high: 13.5,
      low: 13.18,
      open: 13.47,
      volumefrom: 513872.73,
      volumeto: 6836004.14,
      close: 13.36,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672848000,
      high: 13.62,
      low: 13.26,
      open: 13.36,
      volumefrom: 411749.38,
      volumeto: 5546592.27,
      close: 13.48,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672851600,
      high: 13.6,
      low: 13.38,
      open: 13.48,
      volumefrom: 308952.5,
      volumeto: 4172407.04,
      close: 13.46,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672855200,
      high: 13.56,
      low: 13.39,
      open: 13.46,
      volumefrom: 395088.58,
      volumeto: 5327411.06,
      close: 13.45,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672858800,
      high: 13.57,
      low: 13.09,
      open: 13.45,
      volumefrom: 621370.93,
      volumeto: 8224279.66,
      close: 13.18,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672862400,
      high: 13.22,
      low: 12.82,
      open: 13.18,
      volumefrom: 646784.42,
      volumeto: 8378891.18,
      close: 12.96,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672866000,
      high: 13.14,
      low: 12.96,
      open: 12.96,
      volumefrom: 257397.91,
      volumeto: 3367546.43,
      close: 13.13,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672869600,
      high: 13.64,
      low: 13.13,
      open: 13.13,
      volumefrom: 359565.62,
      volumeto: 4820206.91,
      close: 13.56,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672873200,
      high: 13.64,
      low: 13.39,
      open: 13.56,
      volumefrom: 351493.81,
      volumeto: 4739581.59,
      close: 13.44,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672876800,
      high: 13.44,
      low: 13.15,
      open: 13.44,
      volumefrom: 325953.51,
      volumeto: 4339912.71,
      close: 13.18,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672880400,
      high: 13.32,
      low: 13.04,
      open: 13.18,
      volumefrom: 247828.87,
      volumeto: 3271262.86,
      close: 13.23,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672884000,
      high: 13.35,
      low: 13.11,
      open: 13.23,
      volumefrom: 211253.62,
      volumeto: 2791587.22,
      close: 13.27,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672887600,
      high: 13.28,
      low: 13.12,
      open: 13.27,
      volumefrom: 146497.24,
      volumeto: 1934988.26,
      close: 13.21,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672891200,
      high: 13.48,
      low: 13.2,
      open: 13.21,
      volumefrom: 280048.54,
      volumeto: 3741715,
      close: 13.34,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672894800,
      high: 13.41,
      low: 13.27,
      open: 13.34,
      volumefrom: 126114.08,
      volumeto: 1682013.84,
      close: 13.31,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672898400,
      high: 13.34,
      low: 13.14,
      open: 13.31,
      volumefrom: 167555.23,
      volumeto: 2217529.88,
      close: 13.2,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672902000,
      high: 13.27,
      low: 13.13,
      open: 13.2,
      volumefrom: 138054.74,
      volumeto: 1823644.95,
      close: 13.24,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672905600,
      high: 13.29,
      low: 13.13,
      open: 13.24,
      volumefrom: 142369.4,
      volumeto: 1879995.52,
      close: 13.18,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672909200,
      high: 13.2,
      low: 12.95,
      open: 13.18,
      volumefrom: 215041.21,
      volumeto: 2808012.2,
      close: 13.04,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672912800,
      high: 13.25,
      low: 13.04,
      open: 13.04,
      volumefrom: 139791.16,
      volumeto: 1838798.95,
      close: 13.2,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672916400,
      high: 13.31,
      low: 13.14,
      open: 13.2,
      volumefrom: 121812.41,
      volumeto: 4009822.61,
      close: 13.28,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672920000,
      high: 13.34,
      low: 13.2,
      open: 13.28,
      volumefrom: 125012.71,
      volumeto: 1657765.85,
      close: 13.22,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672923600,
      high: 13.23,
      low: 13.09,
      open: 13.22,
      volumefrom: 145276,
      volumeto: 1912826.74,
      close: 13.09,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672927200,
      high: 13.21,
      low: 13.03,
      open: 13.09,
      volumefrom: 191544.53,
      volumeto: 7003972.91,
      close: 13.15,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672930800,
      high: 13.39,
      low: 13.14,
      open: 13.15,
      volumefrom: 269588.75,
      volumeto: 9099083.52,
      close: 13.28,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672934400,
      high: 13.31,
      low: 13.12,
      open: 13.28,
      volumefrom: 118317.06,
      volumeto: 8962096.61,
      close: 13.17,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672938000,
      high: 13.18,
      low: 13.15,
      open: 13.17,
      volumefrom: 5569.23,
      volumeto: 8062096.61,
      close: 13.17,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672934400,
      high: 13.31,
      low: 13.12,
      open: 13.28,
      volumefrom: 118317.06,
      volumeto: 8562096.61,
      close: 13.17,
      conversionType: "direct",
      conversionSymbol: "",
    },
    {
      time: 1672934400,
      high: 13.31,
      low: 13.12,
      open: 13.28,
      volumefrom: 118317.06,
      volumeto: 10062096.61,
      close: 13.17,
      conversionType: "direct",
      conversionSymbol: "",
    },
  ];
  
  export const ChartIndices = () => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const toggleLoad = () => {
     setIsLoaded(!isLoaded);
   };
  
    // const { data, isLoading } = useQuery<any>(["chart"], () =>
    //   WVWServices.getChartInfo()
    // );
  
    // console.log(data);
  
    return (
     <><Card className="w-full  space-y-5 p-4 bg-transparent">
        
          <ResponsiveContainer width="100%" height={400}>
             <AreaChart
                data={data}
                margin={{ top: 30, right: 20, left: 0, bottom: 0 }}
             >
                <defs>
                   <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="#FF008A" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#520283" stopOpacity={0} />
                   </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} />
                <YAxis axisLine={false} tickCount={6} />
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                <Tooltip />
                <Area
                   type="monotone"
                   dataKey="volumeto"
                   stroke="#ff008a"
                   strokeWidth={1.2}
                   fillOpacity={1}
                   fill="url(#colorUv)" />
             </AreaChart>
          </ResponsiveContainer>
         </Card>
          </>
  
    );
  };
  
  export default ChartIndices;