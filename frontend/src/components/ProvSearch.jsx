import '@styles/provsearch.css';
import searchIcon from '../assets/SearchIcon.svg';

function ProvSearch({ value, onChange, placeholder, searchBy, onSearchByChange }) {
    return (
        <div className="psearch-container">
            <select className="psearch-select" value={searchBy} onChange={onSearchByChange}>
                <option value="nombre">Nombre</option>
                <option value="email">Email</option>
                <option value="medioPago">Medio de Pago</option>
                <option value="productos">Productos</option>
            </select>
            <input
                type="text"
                className='psearch-input-table'
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

export default ProvSearch;