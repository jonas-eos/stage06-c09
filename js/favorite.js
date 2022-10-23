
export class Favorite {
  #root;
  #tbody;
  #entries = [];

  get tbody() {
    return this.#tbody;
  }

  get root() {
    return this.#root;
  };

  get entries() {
    return this.#entries;
  }

  /**
   * Remove a data if exists the propertie remove in datas
   *  or add new data
   *
   * @param {object} datas the data content
   */
  set entries(datas) {
    if (datas.remove) {
      this.#entries.splice(datas.entryIndex, 1);

      return;
    }
    this.#entries.unshift(datas)
  };

  /**
   * Create a new class that are loaded with app and get the
   *  tbody element to work on the table datas, after that load
   *  localStorage data.
   * @param {HTMLElement} app The app element to be worked in the app
   */
  constructor(app) {
    this.#root = document.querySelector(app);
    this.#tbody = this.root.querySelector('tbody');

    this.#load();
  };

  /**
   * Get localStorage data and save on entries atribute
   */
  #load() {
    const temp = localStorage.getItem("@gitfav:");
    this.#entries = [...JSON.parse(temp)] || [];
  }

  /**
   * Save as JSON the entries atribute in the '@gitfav' localStorage
   */
  save() {
    localStorage.setItem("@gitfav:", JSON.stringify(this.#entries));
  };

  /**
   * Check first if user want to delete the user from
   *  table list, if confirmed, get user index on entries
   *  and send to setter to remove the user on the entries list
   *  after that save the new content on localStorage
   *
   * @param {object} user The user object to work on
   */
  delete(user) {
    if (confirm(`Remove ${user.login}`) === true) {
      const entryIndex = this.#entries.indexOf(user);
      this.entries = {remove: true, entryIndex};
      this.save();
    };
  };
};
