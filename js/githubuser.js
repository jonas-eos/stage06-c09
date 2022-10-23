export class GithubUser {

  /**
   * Search for github user using the github api
   *
   * @param {String} username The github username
   * @returns Return github api datas: login, name, public reposiory and followers
   */
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  };
};
