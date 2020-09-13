export class EventEmitter {
    constructor(assa) {
      this.events = {};
    }
      
    /**
     * @param {string} eventName
     * @param {Function} callback
     */
    subscribe(eventName, callback) {
      !this.events[eventName] && (this.events[eventName] = []);
      this.events[eventName].push(callback);
    }
    
    /**
     * @param {string} eventName
     * @param {Function} callback
     */
    unsubscribe(eventName, callback) {
      this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
    }
    
    /**
     * @param {string} eventName
     * @param {any} args
     */
    emit(eventName, args) {
      const event = this.events[eventName];
      event && event.forEach(callback => callback.call(null, args));
    }
  }