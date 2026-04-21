import { useEffect, useState } from "react";

function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
  fetch(`https://api.rawg.io/api/games?key=90397a5572154d60969070c2c1d04b91&page=${page}`)
    .then((res) => res.json())
    .then((data) => {
      setGames((prev) => [...prev, ...data.results]);
      setLoading(false);
    })
    .catch(() => {
      setError("Bir hata oluştu");
      setLoading(false);
    });
}, [page]);

  // ✅ BURASI ÖNEMLİ
  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Oyun Ara"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h1>Game Explorer</h1>

      <div className="games">
        {filteredGames.map((game) => (
          <div className="game-card" key={game.id}>
            <img src={game.background_image} alt={game.name} />
            <h3>{game.name}</h3>
            <p>Rating: {game.rating}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setPage(page + 1)}>
         Daha fazla yükle
      </button>
    </div>
  );
}

export default App;