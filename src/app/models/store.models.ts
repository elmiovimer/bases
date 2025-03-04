export namespace ModelsStore{
    export interface Item {
        id? : string;
        date? : Date;
        name: string;
        desc: string;
        price: number;
        image?: string;
        stock: number;
        categories?: string[];
        salty?: boolean;
        enable? : boolean;
        // link?: string;
    }
    export interface Order {}
    export interface Cart {
        total: number;
        totalQT: number;
        items:{
            item: Item;
            cant: number;
        }[]
    }

}
