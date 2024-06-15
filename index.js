import axios from "axios";

const url = process.argv[2].replace("--url=", "");
const token = process.argv[3].replace("--token=", "");
const repoData = url.replace("https://github.com/", "").split("/");
const [owner, repo] = repoData;

const maxPage = 1000;

const getCommits = async () => {
  const authors = {};
  for (let page = 1; page < maxPage; page++) {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits?page=${page}`,
      { Authorization: `Bearer ${token}` }
    );
    const { data } = response;
    if (!data.length) {
      break;
    }
    data.forEach(({ commit }) => {
      const { author } = commit;
      if (authors[author.email]) {
        authors[author.email] = {
          name: author.name,
          timeline: [...authors[author.email].timeline, author.date],
        };
      } else {
        authors[author.email] = {
          name: author.name,
          timeline: [author.date],
        };
      }
    });
  }
  console.log("authors", authors);
};

getCommits();
