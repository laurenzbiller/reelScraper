export class Entity {
    title: string;
    topic: string;
    type: string;
    timestamp: number;
    source: {
        url: string;
        platform: string;
        rawDescription?: string;
        rawTranscription?: string;
    };

    data: Record<string, any>;

    constructor(
        title: string,
        topic: string,
        type: string,
        timestamp: number,
        source: {
            url: string;
            platform: string;
            rawDescription?: string;
            rawTranscription?: string;
        },
        data: Record<string, any>
    ) {
        this.title = title;
        this.topic = topic;
        this.type = type;
        this.timestamp = timestamp;
        this.source = source;
        this.data = data;
    }

    // Constructor that takes a JSON object
    static fromJSON(json: any): Entity {
        return new Entity(
            json.title,
            json.topic,
            json.type,
            json.timestamp,
            json.source,
            json.data || {}
        );
    }
}

export class CreateEntityDto {
    topic_action: string;
    title: string;
    topic: string;
    type: string;
    timestamp: number;
    source: {
        url: string;
        platform: string;
        rawDescription?: string;
        rawTranscription?: string;
    };
    data: Record<string, any>;

    constructor(
        topic_action: string,
        title: string,
        topic: string,
        type: string,
        timestamp: number,
        source: {
            url: string;
            platform: string;
            rawDescription?: string;
            rawTranscription?: string;
        },
        data: Record<string, any>
    ) {
        this.topic_action = topic_action;
        this.title = title;
        this.topic = topic;
        this.type = type;
        this.timestamp = timestamp;
        this.source = source;
        this.data = data;
    }

    // Static method that takes a JSON object
    static fromJSON(json: any): CreateEntityDto {
        return new CreateEntityDto(
            json.topic_action,
            json.title,
            json.topic,
            json.type,
            json.timestamp,
            json.source,
            json.data || {}
        );
    }
}