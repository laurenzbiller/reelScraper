export class Entity {
    title: string;
    primary: string;
    action: ActionData | null;
    location: LocationData | null;
    price: PriceData | null;
    steps: Array<string> | null;
    items: Array<ItemData> | null;
    tags: Array<string>;
    timestamp: number;
    topic: string;
    type: string;
    source: SourceData | null;

    constructor(title: string, primary: string, action: ActionData | null = null, location: LocationData | null = null, price: PriceData | null = null, steps: Array<string> | null = null, items: Array<ItemData> | null = null, tags: Array<string> = [], timestamp: number = 0, topic: string = '', type: string = '', source: SourceData | null = null) {
        this.title = title;
        this.primary = primary;
        this.action = action;
        this.location = location;
        this.price = price;
        this.steps = steps;
        this.items = items;
        this.tags = tags;
        this.timestamp = timestamp;
        this.topic = topic;
        this.type = type;
        this.source = source;
    }

    static fromJSON(json: any): Entity {
        return new Entity(
            json.title ?? '',
            json.primary ?? '',
            json.action ? ActionData.fromJSON(json.action) : null,
            json.location ? LocationData.fromJSON(json.location) : null,
            json.price ? PriceData.fromJSON(json.price) : null,
            json.steps ?? null,
            json.items ? json.items.map((item: any) => ItemData.fromJSON(item)) : null,
            json.tags ?? [],
            json.timestamp ?? 0,
            json.topic ?? '',
            json.type ?? '',
            json.source ? SourceData.fromJSON(json.source) : null
        );
    }
}

class ActionData {
    label: string | null;
    url: string | null;

    constructor(label: string | null = null, url: string | null = null) {
        this.label = label;
        this.url = url;
    }

    static fromJSON(json: any): ActionData {
        return new ActionData(
            json.label ?? null,
            json.url ?? null
        );
    }
}

class LocationData {
    name: string | null;
    address: string | null;
    city: string | null;

    constructor(name: string | null = null, address: string | null = null, city: string | null = null) {
        this.name = name;
        this.address = address;
        this.city = city;
    }

    static fromJSON(json: any): LocationData {
        return new LocationData(
            json.name ?? null,
            json.address ?? null,
            json.city ?? null
        );
    }
}

class PriceData {
    amount: number | null;
    currency: string | null;
    note: string | null;

    constructor(amount: number | null = null, currency: string | null = null, note: string | null = null) {
        this.amount = amount;
        this.currency = currency;
        this.note = note;
    }

    static fromJSON(json: any): PriceData {
        return new PriceData(
            json.amount ?? null,
            json.currency ?? null,
            json.note ?? null
        );
    }
}

class ItemData {
    name: string;
    detail: string | null;
    price: string | null;
    url: string | null;

    constructor(name: string, detail: string | null = null, price: string | null = null, url: string | null = null) {
        this.name = name;
        this.detail = detail;
        this.price = price;
        this.url = url;
    }

    static fromJSON(json: any): ItemData {
        return new ItemData(
            json.name ?? '',
            json.detail ?? null,
            json.price ?? null,
            json.url ?? null
        );
    }
}

export class SourceData {
    url: string;
    rawDescription: string;
    rawTranscription: string;

    constructor(url: string = '', rawDescription: string = '', rawTranscription: string = '') {
        this.url = url;
        this.rawDescription = rawDescription;
        this.rawTranscription = rawTranscription;
    }

    static fromJSON(json: any): SourceData {
        return new SourceData(
            json.url ?? '',
            json.rawDescription ?? '',
            json.rawTranscription ?? ''
        );
    }
}

export class CreateEntityDto {
    title: string;
    primary: string;
    details: Array<string>;
    action: ActionData | null;
    location: LocationData | null;
    price: PriceData | null;
    steps: Array<string> | null;
    items: Array<ItemData> | null;
    tags: Array<string>;
    timestamp: number;
    topic: string;
    type: string;
    source: SourceData | null;

    constructor(
        title: string,
        primary: string,
        details: Array<string>,
        action: ActionData | null = null,
        location: LocationData | null = null,
        price: PriceData | null = null,
        steps: Array<string> | null = null,
        items: Array<ItemData> | null = null,
        tags: Array<string> = [],
        timestamp: number = 0,
        topic: string = '',
        type: string = '',
        source: SourceData | null = null
    ) {
        this.title = title;
        this.primary = primary;
        this.details = details;
        this.action = action;
        this.location = location;
        this.price = price;
        this.steps = steps;
        this.items = items;
        this.tags = tags;
        this.timestamp = timestamp;
        this.topic = topic;
        this.type = type;
        this.source = source;
    }

    static fromJSON(json: any): CreateEntityDto {
        return new CreateEntityDto(
            json.title ?? '',
            json.primary ?? '',
            json.details ?? [],
            json.action ? ActionData.fromJSON(json.action) : null,
            json.location ? LocationData.fromJSON(json.location) : null,
            json.price ? PriceData.fromJSON(json.price) : null,
            json.steps ?? null,
            json.items ? json.items.map((item: any) => ItemData.fromJSON(item)) : null,
            json.tags ?? [],
            json.timestamp ?? 0,
            json.topic ?? '',
            json.type ?? '',
            json.source ? SourceData.fromJSON(json.source) : null
        );
    }
}
