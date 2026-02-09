
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose lg:prose-lg">
          <h1 className="text-4xl font-extrabold text-base-blue">Política de Privacidade</h1>
          <p className="text-lg text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <p>A sua privacidade é importante para nós. É política da Rabello ADS respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Rabello ADS, e outros sites que possuímos e operamos.</p>

          <h2>1. Coleta de Dados</h2>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
          <p>Quando você preenche nosso formulário de contato, coletamos seu nome, e-mail e a mensagem que você nos envia. Esses dados são usados exclusivamente para responder ao seu contato e analisar o cenário do seu negócio, conforme solicitado.</p>

          <h2>2. Uso dos Dados</h2>
          <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
          <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>
          
          <h2>3. Cookies</h2>
          <p>O nosso site pode usar cookies para melhorar a experiência do usuário. Cookies são pequenos arquivos de dados que são colocados no seu computador ou dispositivo móvel quando você visita um site. Você pode configurar seu navegador para recusar cookies, mas isso pode impedir o funcionamento de algumas partes do nosso site.</p>
          
          <h2>4. Links para Sites de Terceiros</h2>
          <p>O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
          
          <h2>5. Seus Direitos</h2>
          <p>Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados. De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento, entrando em contato conosco.</p>
          
          <h2>6. Compromisso do Usuário</h2>
          <p>O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.</p>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
