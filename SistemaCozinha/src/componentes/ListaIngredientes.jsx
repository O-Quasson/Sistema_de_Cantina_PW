function normalizarChave(nome) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function ListaIngredientes({ ingredientes, novoIngrediente, onNovoIngrediente, editavel, onAdicionar, onRemover }) {
  return (
    <div className="ingredient-editor">
      <div className="section-heading-row">
        <div>
          <h4 className="section-heading">Ingredientes</h4>
          <p className="section-help">Adicione cada ingrediente separadamente.</p>
        </div>
        <span className="count-badge">{ingredientes.length}</span>
      </div>

      {ingredientes.length ? (
        <ul className="ingredient-list" aria-label="Ingredientes do almoço">
          {ingredientes.map((nome) => (
            <li className="ingredient-item" key={normalizarChave(nome)}>
              <span className="ingredient-name">{nome}</span>
              {editavel && (
                <button
                  type="button"
                  className="botao-remover-item"
                  onClick={() => onRemover(nome)}
                  aria-label={`Remover ${nome}`}
                >
                  Remover
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state compact">
          <span>Nenhum ingrediente cadastrado.</span>
        </div>
      )}

      {editavel && (
        <div className="add-ingredient">
          <input
            id="novo-ingrediente"
            name="novoIngrediente"
            type="text"
            maxLength={100}
            value={novoIngrediente}
            placeholder="Ex.: arroz"
            aria-label="Novo ingrediente"
            onChange={(event) => onNovoIngrediente(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onAdicionar();
              }
            }}
          />
          <button type="button" className="botao-secundario" onClick={onAdicionar}>
            Adicionar ingrediente
          </button>
        </div>
      )}
    </div>
  );
}
