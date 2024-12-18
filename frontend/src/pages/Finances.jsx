import { useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import '@styles/finances.css';
import dayjs from 'dayjs';
import Spinner from '../components/Login/Spinner.jsx';
import { useFinancesData } from '../hooks/transactions/useFinancesData';

const Finances = () => {
    const [selectedRange, setSelectedRange] = useState(7);

    const {
        pieData,
        transactions,
        criticalProducts,
        lineChartData,
        loading
    } = useFinancesData(selectedRange);

    const COLORS = ['#00C49F', '#FF0000'];
    const sourceDisplay = { bar: 'Bar', cocina: 'Cocina', otros: 'Otros' };

    if (loading) {
        return (
            <div className="finances-loading-container">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="finances-container">
            <div className="charts-container">
                <div className="chart-item pie-chart-container">
                    <h2>Ingresos vs Gastos</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-item table-container">
                    <h2>Transacciones</h2>
                    <div className="transactions-container">
                        <table className="transactions-table">
                            <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Origen</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((t, index) => (
                                <tr key={index}>
                                    <td>{dayjs(t.createdAt).format('DD/MM/YYYY')}</td>
                                    <td>{t.description}</td>
                                    <td className={`amount ${t.type === 'income' ? 'income' : 'expense'}`}>
                                        ${parseFloat(t.amount).toFixed(2)}
                                    </td>
                                    <td>{sourceDisplay[t.source] || 'Otros'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {criticalProducts && criticalProducts.length > 0 && (
                    <div className="chart-item table-container">
                        <h2>Productos Críticos</h2>
                        <div className="transactions-container">
                            <table className="transactions-table">
                                <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad Actual</th>
                                    <th>Mínimo Permitido</th>
                                    <th>Unidad</th>
                                    <th>Proveedor</th>
                                </tr>
                                </thead>
                                <tbody>
                                {criticalProducts.map((prod, idx) => (
                                    <tr key={idx}>
                                        <td>{prod.nombreProducto}</td>
                                        <td>{prod.cantidadProducto}</td>
                                        <td>{prod.minThreshold}</td>
                                        <td>{prod.stockUnit}</td>
                                        <td>{prod.supplierName || 'N/A'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="chart-item">
                    <h2>Ventas por Fuente (últimos {selectedRange} días)</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Rango de días: </label>
                        <select value={selectedRange} onChange={e => setSelectedRange(parseInt(e.target.value))}>
                            <option value={7}>7 días</option>
                            <option value={14}>14 días</option>
                            <option value={30}>30 días</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="bar" stroke="#82ca9d" name="Bar" />
                            <Line type="monotone" dataKey="cocina" stroke="#8884d8" name="Cocina" />
                            <Line type="monotone" dataKey="otros" stroke="#FF0000" name="Otros" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Finances;
