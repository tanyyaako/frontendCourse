import { useState, useEffect } from "react";
import "./css/NoActiveServices.css"
import "./css/CreateComponent.css"
import "./css/ActiveServices.css"

export default function HomePage() {
    const [activeServices, setActiveServices] = useState([]);
    const [noActiveServices, setNoActiveServices] = useState([]); 
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalArchive, setShowModalArchive] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    const confirmDelete = (id) => {
        setSelectedServiceId(id);
        setShowModalDelete(true);
    };

    const proceedDelete = () => {
        handleDelete(selectedServiceId);
        setShowModalDelete(false);
        setSelectedServiceId(null);
    };

    const cancelDelete = () => {
        setShowModalDelete(false);
        setSelectedServiceId(null);
    };

    const confirmArchive = (id) => {
        setSelectedServiceId(id);
        setShowModalArchive(true);
    };

    const proceedArchive = () => {
        handleArchive(selectedServiceId);
        setShowModalArchive(false);
        setSelectedServiceId(null);
    };

    const cancelArchive = () => {
        setShowModalArchive(false);
        setSelectedServiceId(null);
    };

    useEffect(() => {
        fetch('/service/active')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }
                return response.json();
            })
            .then(data => setActiveServices(data))
            .catch(error => console.error(error));
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/service/${id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                console.log('Удалено успешно');
                setActiveServices((prevServices) => prevServices.filter(service => service.id !== id));
            } else {
                console.error('Ошибка при удалении');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleArchive = async (id) => {
        try {
            const response = await fetch(`/service/${id}/active`, {
                method: 'PATCH',
            })
            if (response.ok) {
                console.log('Архивировано успешно');
                setActiveServices(prev => prev.filter(service => service.id !== id));
                const serviceToMove = activeServices.find(service => service.id === id);
                if (serviceToMove) {
                    setNoActiveServices(prev => [...prev, serviceToMove]);
                }
            } else {
                console.error('Ошибка при архивировании');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration: 0,
        category: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/service/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Отправлено успешно!');
                const result = await response.json();
                setActiveServices(prev => [...prev, result]);
                console.log('Ответ от сервера:', result);
                setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    duration: 0,
                    category: ''
                });
                setShowModalCreate(false);
            } else {
                console.error('Ошибка при отправке данных');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetch('/service/inactive')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }
                return response.json();
            })
            .then(data => setNoActiveServices(data))
            .catch(error => console.error(error));
    }, []);

    const handleUnArchive = async (id) => {
        try {
            const response = await fetch(`/service/${id}/active`, {
                method: 'PATCH',
            })
            if (response.ok) {
                console.log('Разархивировано успешно');
                setNoActiveServices(prev => prev.filter(service => service.id !== id));
                const serviceToMove = noActiveServices.find(service => service.id === id);
                if (serviceToMove) {
                    setActiveServices(prev => [...prev, serviceToMove]);
                }
            } else {
                console.error('Ошибка при архивировании');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='mainContoiner'>
            <div className="container">
                <div className="headerContainer">
                    <h2 className="services">Услуги</h2>
                    <button className="createButton" onClick={() => setShowModalCreate(true)}>
                        Создать услугу
                    </button>
                    <button className="createButtonMobile" onClick={() => setShowModalCreate(true)}>
                        Создать услугу
                    </button>
                </div>
                {showModalCreate && (
                    <div className="modalCreate">
                        <div className="modalCreateContent">
                            <h2 className="createText">Создать услугу</h2>
                            <div className="line"></div>
                            <form className="form" onSubmit={handleSubmit}>
                                <label>
                                    Название
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Цена
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Продолжительность (мин)
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Категория
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Описание
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </label>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <button className="buttonCreate" type="submit">Сохранить</button>
                                    <button className="deleteButtonArchive" type="button" onClick={() => setShowModalCreate(false)}>
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className="line"></div>
                <ul className="list">
                    {activeServices.map((service) => (
                        <li className="item" key={service.id}>
                            <div className="info">
                                <div><strong>{service.name}</strong> - {service.price}р.</div>
                                <p>{service.description}</p>
                                <p><strong>Продолжительность в минутах:</strong> {service.duration}</p>
                                <p><strong>Категория услуги:</strong> {service.category}</p>
                            </div>
                            <div className="buttons">
                                <button className="buttonArchive" onClick={() => confirmArchive(service.id)}>Архивировать</button>
                                <button className="deleteButton" onClick={() => confirmDelete(service.id)}>Удалить</button>
                            </div>
                        </li>
                    ))}
                </ul>
                {showModalDelete && (
                    <div className="modalDelete">
                        <div className="modalContent">
                            <p>Вы действительно хотите удалить эту услугу?</p>
                            <div className="modalButtonsDelete">
                                <button onClick={proceedDelete}>Да</button>
                                <button onClick={cancelDelete}>Отмена</button>
                            </div>
                        </div>
                    </div>
                )}
                {showModalArchive && (
                    <div className="modalDelete">
                        <div className="modalContent">
                            <p>Вы действительно хотите архивировать эту услугу?</p>
                            <div className="modalButtonsDelete">
                                <button onClick={proceedArchive}>Да</button>
                                <button onClick={cancelArchive}>Отмена</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className='rightContainer'>
                <div className="containerCreate">
                    <h2 className="createText">Создать услугу</h2>
                    <div className="line"></div>
                    <form className="form" onSubmit={handleSubmit}>
                        <label>
                            Название
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Цена
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Продолжительность (мин)
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Категория
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Описание
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}

                            />
                        </label>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="buttonCreate" type="submit">Сохранить</button>
                        </div>
                    </form>
                </div>
                <div className="containerNoActive">
                    <h2 className="servicesArchive">Архивированные услуги</h2>
                    <div className="line"></div>
                    <ul className="listArchive">
                        {noActiveServices.map((service, index) => (
                            <li className="itemArchive" key={index}>
                                <div className="infoArchive">
                                    <div><strong>{service.name}</strong> - {service.price}р.</div>
                                    <p>{service.description}</p>
                                    <p><strong>Продолжительность в минутах:</strong> {service.duration}</p>
                                    <p><strong>Категория услуги:</strong> {service.category}</p>
                                </div>
                                <div className="buttons">
                                    <button className="archiveButton2" onClick={() => handleUnArchive(service.id)}>Разрхивировать</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}