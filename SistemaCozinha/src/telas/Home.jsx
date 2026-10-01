import imagens from '../assets/imagens.png';
import '../estilos/home.css';

export default function Homescreen() {
  return (
    <main className="home-container">
      <div className="home-text-section">
        <h1 className="home-title">Bem-vindo</h1>
        <p className="home-text">
          Este site visa reduzir o desperdício de alimentos por parte dos alunos da ETEC Bento Quirino, a fim de melhorar a utilização dos alimentos preparados.
        </p>
      </div>
      <img src={imagens} className="home-image" alt="Ilustração relacionada à alimentação escolar" />
    </main>
  );
}
