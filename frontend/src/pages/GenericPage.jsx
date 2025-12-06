import React, { useState } from 'react';
import Input from '../components/Input'; // Reaproveitando seu componente Input
import { toast } from 'react-toastify';

// Página genérica para "Sobre", "Contato", "Políticas"
export default function GenericPage({ title }) {
  
  // --- Lógica para o Formulário de Contato ---
  const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulação de envio
        setTimeout(() => {
            toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Seu Nome" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Seu E-mail" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Input label="Assunto" name="subject" value={formData.subject} onChange={handleChange} required />
            
            <div>
                <label className="block text-sm font-medium text-brand-secondary mb-1">Mensagem</label>
                <textarea 
                    name="message" 
                    rows="4" 
                    value={formData.message} 
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-brand-text placeholder-gray-400 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm"
                    required
                ></textarea>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary text-white font-bold py-3 rounded-md hover:bg-brand-primary-dark transition-colors disabled:opacity-70 shadow-sm"
            >
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
        </form>
    );
  };

  // --- Conteúdo da Página "Contato" ---
  const renderContactContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Coluna da Esquerda: Informações e Mapa */}
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-brand-secondary font-serif mb-4">Fale Conosco</h3>
                <p className="text-brand-text mb-6">
                    Tem alguma dúvida sobre um pedido, produto ou quer apenas dar um oi? 
                    Estamos à disposição para atender você!
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <div>
                            <h4 className="font-bold text-brand-secondary">Endereço</h4>
                            <p className="text-sm text-gray-600">Rua Reinoldo Rau, 123, Centro<br/>Jaraguá do Sul - SC, 89251-000</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                        <div>
                            <h4 className="font-bold text-brand-secondary">Telefone / WhatsApp</h4>
                            <p className="text-sm text-gray-600">(47) 99999-8888</p>
                            <p className="text-xs text-gray-500">Seg a Sex: 09h às 18h</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        <div>
                            <h4 className="font-bold text-brand-secondary">E-mail</h4>
                            <p className="text-sm text-gray-600">contato@caquicanela.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mapa (Iframe do Google Maps) */}
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-md border border-gray-200">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3576.468799644828!2d-49.07417648496724!3d-26.31129668339062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94de90bb8d63c843%3A0x2869c6276f41e036!2sCentro%2C%20Jaragu%C3%A1%20do%20Sul%20-%20SC!5e0!3m2!1spt-BR!2sbr!4v1697555555555!5m2!1spt-BR!2sbr" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa da Loja"
                ></iframe>
            </div>
        </div>

        {/* Coluna da Direita: Formulário */}
        <div className="bg-gray-50 p-8 rounded-lg shadow-inner">
            <h3 className="text-xl font-bold text-brand-secondary font-serif mb-6">Envie uma mensagem</h3>
            <ContactForm />
        </div>
    </div>
  );

  // Conteúdo específico para "Sobre Nós"
  const renderAboutContent = () => (
    <div className="space-y-8">
      <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden mb-8 shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Loja de Roupas Femininas" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="prose lg:prose-lg text-brand-text mx-auto">
        <p className="lead text-xl text-brand-secondary font-serif italic text-center mb-8">
          "Vestir-se bem é uma forma de autocuidado. Na CaquiCanela, acreditamos que cada peça conta uma história."
        </p>

        <h3 className="text-2xl font-bold text-brand-secondary font-serif mt-8 mb-4">Nossa História</h3>
        <p>
          A <strong>CaquiCanela</strong> nasceu do sonho de oferecer moda feminina que une elegância, conforto e versatilidade. 
          Fundada em Jaraguá do Sul, nossa marca começou como uma pequena loja física com o propósito de trazer peças que 
          valorizam a beleza natural de cada mulher, sem abrir mão do bem-estar no dia a dia.
        </p>
        <p>
          O nome "CaquiCanela" remete aos tons terrosos e naturais que tanto amamos, simbolizando nossa conexão com 
          o que é autêntico e atemporal. Cada coleção é pensada para a mulher moderna, que transita entre o trabalho, 
          momentos de lazer e ocasiões especiais com a mesma confiança.
        </p>

        <h3 className="text-2xl font-bold text-brand-secondary font-serif mt-8 mb-4">Nossa Missão</h3>
        <p>
          Proporcionar uma experiência de compra única, oferecendo produtos de alta qualidade que inspirem confiança e 
          autoestima. Queremos ser mais do que uma loja de roupas; queremos ser parte dos momentos especiais da sua vida.
        </p>

        <h3 className="text-2xl font-bold text-brand-secondary font-serif mt-8 mb-4">Nossos Valores</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Autenticidade:</strong> Valorizamos o estilo único de cada cliente.</li>
          <li><strong>Qualidade:</strong> Selecionamos tecidos e acabamentos que duram.</li>
          <li><strong>Atendimento Humanizado:</strong> Seja online ou presencial, você é nossa prioridade.</li>
          <li><strong>Sustentabilidade:</strong> Buscamos parceiros e processos que respeitem o meio ambiente.</li>
        </ul>

        <div className="mt-12 p-6 bg-brand-background/30 rounded-lg text-center">
          <p className="font-medium text-brand-secondary">
            Obrigado por fazer parte da nossa jornada.<br/>
            Com carinho, Equipe CaquiCanela.
          </p>
        </div>
      </div>
    </div>
  );

  // Conteúdo padrão (para outras páginas genéricas que ainda não têm texto específico)
  const renderDefaultContent = () => (
    <div className="space-y-4 text-brand-text prose lg:prose-lg">
      <p>
        Esta página está em construção. Em breve traremos mais informações sobre {title}.
      </p>
       {title === "Política de Trocas" && (
        <div className="mt-6 space-y-4">
           <p><strong>1. Prazo:</strong> Você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução.</p>
           <p><strong>2. Condições:</strong> A peça deve estar com a etiqueta, sem sinais de uso ou lavagem.</p>
           <p><strong>3. Processo:</strong> Envie um e-mail para nosso suporte informando o número do pedido.</p>
        </div>
      )}
    </div>
  );

  // Decide qual conteúdo renderizar baseado no título
  let content;
  if (title === "Contato") content = renderContactContent();
  else if (title === "Sobre Nós") content = renderAboutContent();
  else content = renderDefaultContent();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg border border-gray-100">
        <h1 className="text-4xl font-bold text-brand-secondary font-serif mb-10 text-center border-b-2 border-brand-primary/20 pb-4">
          {title}
        </h1>
        {content}
      </div>
    </div>
  );
}