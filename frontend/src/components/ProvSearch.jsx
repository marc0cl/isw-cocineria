import '@styles/provsearch.css';

function ProvSearch({ value, onChange, placeholder, searchBy, onSearchByChange }) {
    return (
        <div className="search-container">
            <select className="search-select" value={searchBy} onChange={onSearchByChange}>
                <option value="nombre">Nombre</option>
                <option value="email">Email</option>
                <option value="medioPago">Medio de Pago</option>
                <option value="productos">Productos</option>
            </select>
            <input
                type="text"
                className='search-input-table'
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

export default ProvSearch;