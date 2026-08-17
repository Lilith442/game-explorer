import { useEffect, useState } from "react";

function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://www.freetogame.com/api/games")
      .then((res) => {
        if (!res.ok) {
          throw new Error("API bağlantısı başarısız");
        }

        return res.json();
      })
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Oyunlar yüklenirken bir hata oluştu.");
        setLoading(false);
      });
  }, []);

  const genres = [
    "All",
    ...new Set(
      games
        .map((game) => game.genre)
        .filter(Boolean)
    ),
  ];

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      genre === "All" || game.genre === genre;

    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div className="status">
        <p>🎮 Oyunlar yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="game-header-logo">
          <img
            src="/game-explorer-logo.png"
            alt="Free Game Explorer"
          />
        </h1>

        <p>
          Free-to-play oyunları keşfet, ara ve incele.
        </p>

        <div className="controls">
          <input
            type="text"
            placeholder="Oyun ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {genres.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "Tüm Türler" : item}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="games">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <article className="game-card" key={game.id}>
              <img
                src={game.thumbnail}
                alt={game.title}
              />

              <div className="game-info">
                <h2>{game.title}</h2>

                <p>
                  <strong>Tür:</strong>{" "}
                  {game.genre || "Belirtilmemiş"}
                </p>

                <p>
                  <strong>Platform:</strong>{" "}
                  {game.platform || "Belirtilmemiş"}
                </p>

                <a
                  href={game.game_url}
                  target="_blank"
                  rel="noreferrer"
                  className="game-btn"
                >
                  Oyunu İncele →
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="no-results">
            <p>🔍 Aradığın kriterlere uygun oyun bulunamadı.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;