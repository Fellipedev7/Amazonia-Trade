// frontend/src/components/ProductForm.jsx
import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import { Link } from 'react-router-dom'; // << 1. IMPORTE O LINK AQUI
import './ProductForm.css';

const ProductForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    rawMaterialStory: '',
    sustainablePractices: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!image) {
      setError('Por favor, selecione uma imagem para o produto.');
      return;
    }
    if (!form.name || !form.description || !form.price) {
        setError('Nome, descrição e preço são obrigatórios.');
        return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('image', image);
    data.append('rawMaterialStory', form.rawMaterialStory);
    data.append('sustainablePractices', form.sustainablePractices);

    try {
      await apiClient.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Produto cadastrado com sucesso! Você pode cadastrar outro.');
      setForm({
        name: '', description: '', price: '',
        rawMaterialStory: '', sustainablePractices: '',
      });
      setImage(null);
      setImagePreview('');
      if (document.getElementById('image-upload-input')) {
        document.getElementById('image-upload-input').value = '';
      }
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err.response || err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Erro ao cadastrar: ${err.response.data.message}`);
      } else if (err.message) {
        setError(`Erro ao cadastrar: ${err.message}`);
      } else {
        setError('Erro desconhecido ao cadastrar o produto.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-form-page"> {/* Este div já tem min-height: 100vh e padding */}
      
      {/* vv 2. ADICIONE O BOTÃO/LINK HOME AQUI vv */}
      <Link to="/home" className="home-nav-button">
        Home
      </Link>
      {/* ^^ BOTÃO/LINK HOME ADICIONADO ^^ */}

      <div className="product-form-container">
        <img src="/logo.png" alt="AmazôniaTrade Logo" className="form-logo" />
        <h2>Cadastrar Novo Produto</h2>
        <p className="form-subtitle">Compartilhe a riqueza da Amazônia com o mundo!</p>

        {error && <p className="form-message error">{error}</p>}
        {success && <p className="form-message success">{success}</p>}

        <form onSubmit={handleSubmit} className="product-actual-form">
          {/* ... resto do seu formulário (fieldsets, inputs, etc.) ... */}
          <fieldset>
            <legend>Informações Básicas do Produto</legend>
            <div className="form-group">
              <label htmlFor="name">Nome do Produto:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ex: Colar de Sementes de Açaí"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Preço (R$):</label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                placeholder="Ex: 49.90"
                value={form.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descrição e História do Produto:</label>
              <textarea
                id="description"
                name="description"
                placeholder="Descrição e história do meu produto."
                value={form.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Origem e Sustentabilidade (Autodeclaração)</legend>
            <div className="form-group">
              <label htmlFor="rawMaterialStory">Conte sobre a Matéria-Prima Principal do seu Produto:</label>
              <textarea
                id="rawMaterialStory"
                name="rawMaterialStory"
                placeholder="Ex: Semente de açaí da comunidade local, madeira de manejo florestal sustentável, argila da várzea do Rio Negro, algodão orgânico da cooperativa..."
                value={form.rawMaterialStory}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sustainablePractices">Como você aplica a Sustentabilidade na sua Produção?</label>
              <textarea
                id="sustainablePractices"
                name="sustainablePractices"
                placeholder="Ex: Coleta das sementes sem prejudicar a palmeira, uso de tintas naturais feitas com urucum e jenipapo, reaproveitamento de sobras de madeira, produção feita em mutirão familiar..."
                value={form.sustainablePractices}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </fieldset>
          
          <div className="form-group file-upload-area">
            <label htmlFor="image-upload-input" className="file-upload-button">
              {image ? image.name : "Escolher Imagem Principal do Produto"}
            </label>
            <input
              id="image-upload-input"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview do produto" className="image-preview" />
              </div>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;