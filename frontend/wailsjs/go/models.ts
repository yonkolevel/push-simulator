export namespace push {

	export class MIDIStatus {
	    ready: boolean;
	    livePort: string;
	    userPort: string;
	    mode: string;
	    channel: number;

	    static createFrom(source: any = {}) {
	        return new MIDIStatus(source);
	    }

	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ready = source["ready"];
	        this.livePort = source["livePort"];
	        this.userPort = source["userPort"];
	        this.mode = source["mode"];
	        this.channel = source["channel"];
	    }
	}
	export class Note {


	    static createFrom(source: any = {}) {
	        return new Note(source);
	    }

	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);

	    }
	}

}

