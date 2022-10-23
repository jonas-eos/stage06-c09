import { Favorite } from "./favorite.js";
import { GithubUser } from "./githubuser.js";

export class FavoriteView extends Favorite {

  constructor(root) {
    super(root);

    this.#search();
    this.#update();
  };

  /**
   * Get the button element and add onclick event to
   *  search the user through gitHub API
   */
  #search() {
    const searchBtn = this.root.querySelector(".search button");

    searchBtn.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.#getGithubUserData(value)
    };
  };

  /**
   * Try to search the username in github api, if
   *  user has already favorited in entry list, then
   *  block to add again, else, save the new user in
   *  entry list and show on table
   *
   * @param {string} username The github username
   */
  async #getGithubUserData(username) {
    try {
      const userHasAlreadyBeenFavorited = this.entries.find(entry => entry.login === username);

      if (userHasAlreadyBeenFavorited) {
        throw new Error("User has already been favorited!");
      };

      const userDatas = await GithubUser.search(username);

      if (userDatas.login === undefined) {
        throw new Error("Username not found!");
      };

      this.entries = userDatas;

      this.#update();
      this.save();
    } catch (error) {
      alert(error.message);
    };
  };

  /**
   * Remove all tr on table content, check if exists at least 1 entry, if not
   *  show a message that does not exists entry yet, if exist a entry, create
   *  the table content with all entry informations.
   *
   * @returns The html table element filled with github user informations
   */
  #update() {
    this.removeAllTr();

    if (this.entries.length === 0) {
      this.#showEmptyTableMessage();

      return;
    }

    this.#removeEmptyMessageTable();

    this.entries.forEach(user => {

      const row = this.#createRow();

      row.querySelector('.user-icon img').src = `https://github.com/${user.login}.png`;
      row.querySelector('.user-icon img').alt = `Image of ${user.name}`;
      row.querySelector('.user-info p').textContent = user.name;
      row.querySelector('.user-info a').href = `https://github.com/${user.login}`;
      row.querySelector('.user-info a').textContent = `/${user.login}`;
      row.querySelector('.repositories p').textContent = user.public_repos;
      row.querySelector('.followers p').textContent = user.followers;

      row.querySelector('.remove button').onclick = () => {
        this.delete(user);
        this.#update();
      };


      this.tbody.append(row);
    });
  };

  /**
   * Create html element to show the message that does not exists any favorite
   *  in entry list
   */
  #showEmptyTableMessage() {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const h2 = document.createElement('h2');

    this.tbody.classList.add("empty-table");
    img.classList.add("empty-table-image");
    h2.classList.add('empty-table-message')
    img.alt = 'A bigstar image'

    img.src = '../assets/bigstar.svg';
    h2.textContent = 'No favorites yet';
    div.append(img);
    div.append(h2);

    this.tbody.append(div);
  }

  /**
   * Create the row template to show on webpage
   *
   * @returns Roe template
   */
  #createRow() {
    const tr = document.createElement('tr');

    const content = `
      <td class="user">
        <div class="user-icon"><img></div>
        <div class="user-info">
          <p></p>
          <a target="_blank"></a>
        </div>
      </td>
      <td class="repositories">
        <p></p>
      </td>
      <td class="followers">
        <p></p>
      </td>
      <td class="remove"><button>Remove</button></td>
    `;

    tr.innerHTML = content;

    return tr;
  };

  /**
   * Remove the message that say that does not exists favorite in entry list
   */
  #removeEmptyMessageTable() {
    this.tbody.classList.remove("empty-table");
    const div = this.tbody.querySelector('div');

    if (div) {
      div.remove();
    };
  }

  /**
   * Remove all table content on table body element
   */
  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove();
    });
  };
};
