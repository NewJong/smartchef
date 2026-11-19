type IoniconName = "leaf-outline" | "nutrition-outline" | "flame-outline" | "pizza-outline" | "time-outline";

export interface Nutrient {
    id: number;
    key: string;
    icon: IoniconName;
    value: number;
    unit: string;
    label: string;
}