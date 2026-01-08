export interface Circuit {
  name: string;
  image: any; 
}

export const circuits: Circuit[] = [
  {
    name: "Monaco Grand Prix",
    image: require("@/assets/images/monaco-city.jpg"),
  },
  {
    name: "Baku Grand Prix",
    image: require("@/assets/images/baku.jpg"),
  },
  {
    name: "Belgian Grand Prix",
    image: require("@/assets/images/belgium.jpg"),
  },
  {
    name: "Monza Grand Prix",
    image: require("@/assets/images/monza.jpeg"),
  },
];