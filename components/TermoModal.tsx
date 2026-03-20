"use client"

import { useState, useEffect } from 'react';
import { X, Printer, Smartphone, Laptop, CreditCard, CheckSquare } from 'lucide-react';
import { registrarHistorico } from '@/app/actions/historico';

interface Funcionario {
    id: string;
    nome: string;
    cpf: string;
    setor: string;
    status: string;
    notebooks?: any[];
    celulares?: any[];
    chips?: any[];
}

interface TermoModalProps {
    func: Funcionario;
    isOpen: boolean;
    onClose: () => void;
}

export default function TermoModal({ func, isOpen, onClose }: TermoModalProps) {
    const [selectedCelulares, setSelectedCelulares] = useState<string[]>([]);
    const [selectedNotebooks, setSelectedNotebooks] = useState<string[]>([]);
    const [selectedChips, setSelectedChips] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setSelectedCelulares(func.celulares?.map(c => c.id) || []);
            setSelectedNotebooks(func.notebooks?.map(n => n.id) || []);
            setSelectedChips(func.chips?.map(c => c.id) || []);
        }
    }, [isOpen, func.celulares, func.notebooks, func.chips]);

    if (!isOpen) return null;

    const temAlgum = (func.celulares?.length ?? 0) > 0 || (func.notebooks?.length ?? 0) > 0 || (func.chips?.length ?? 0) > 0;

    const toggleSelection = (id: string, type: 'cel' | 'note' | 'chip') => {
        if (type === 'cel') {
            setSelectedCelulares(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        } else if (type === 'note') {
            setSelectedNotebooks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        } else {
            setSelectedChips(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        }
    };

    const handlePrint = () => {
        let finalHtml = '';
        
        // Celulares selecionados
        selectedCelulares.forEach(id => {
            const content = document.getElementById(`termo-celular-${id}`);
            if (content) {
                if (finalHtml) finalHtml += '<div style="page-break-before: always;"></div>';
                finalHtml += `<div class="term-page">${content.innerHTML}</div>`;
            }
        });

        // Notebooks selecionados
        selectedNotebooks.forEach(id => {
            const content = document.getElementById(`termo-notebook-${id}`);
            if (content) {
                if (finalHtml) finalHtml += '<div style="page-break-before: always;"></div>';
                finalHtml += `<div class="term-page">${content.innerHTML}</div>`;
            }
        });

        // Chips selecionados
        selectedChips.forEach(id => {
            const content = document.getElementById(`termo-chip-${id}`);
            if (content) {
                if (finalHtml) finalHtml += '<div style="page-break-before: always;"></div>';
                finalHtml += `<div class="term-page">${content.innerHTML}</div>`;
            }
        });

        if (!finalHtml) {
            alert("Selecione pelo menos um equipamento para imprimir.");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        // Registrar o histórico (async no background)
        const itemsGerados: string[] = [];
        if (selectedCelulares.length > 0) itemsGerados.push(`${selectedCelulares.length} Celular(es)`);
        if (selectedNotebooks.length > 0) itemsGerados.push(`${selectedNotebooks.length} Notebook(s)`);
        if (selectedChips.length > 0) itemsGerados.push(`${selectedChips.length} Chip(s)`);
        
        registrarHistorico(
            func.id, 
            'funcionario', 
            'Geração de Termo de Responsabilidade', 
            `Termo gerado para ${func.nome} (${itemsGerados.join(', ')})`
        );

        printWindow.document.write(`
            <html>
                <head>
                    <title>Termo de Responsabilidade - ${func.nome}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.3;
                            font-size: 13px;
                            color: #000;
                            background: white;
                            margin: 0;
                            padding: 0;
                        }
                        .term-page {
                            padding: 1cm 1.5cm;
                            box-sizing: border-box;
                        }
                        p { margin: 0 0 0.5rem 0; }
                        h1, h2, h3, h4, h5, h6 { margin-top: 0; }
                        .text-center { text-align: center; }
                        .font-bold { font-weight: bold; }
                        .text-lg { font-size: 1.1rem; }
                        .mb-8 { margin-bottom: 1.5rem; }
                        .mb-6 { margin-bottom: 1rem; }
                        .mb-4 { margin-bottom: 0.8rem; }
                        .mb-3 { margin-bottom: 0.5rem; }
                        .mb-10 { margin-bottom: 1.8rem; }
                        .mt-12 { margin-top: 1.5rem; }
                        .mt-16 { margin-top: 2rem; }
                        .pl-4 { padding-left: 0.8rem; }
                        .pl-4 p { margin-bottom: 0.25rem; }
                        .pl-6 { padding-left: 1.2rem; }
                        .pt-2 { padding-top: 0.5rem; }
                        .pt-8 { padding-top: 1.5rem; }
                        .uppercase { text-transform: uppercase; }
                        .underline { text-decoration: underline; }
                        .text-justify { text-align: justify; }
                        .grid { display: grid; }
                        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                        .gap-x-12 { column-gap: 3rem; }
                        .gap-y-6 { row-gap: 1.5rem; }
                        .flex { display: flex; }
                        .items-end { align-items: flex-end; }
                        .gap-2 { gap: 0.5rem; }
                        .flex-1 { flex: 1; }
                        .border-b-black { border-bottom: 1px solid black; }
                        .w-8 { width: 2rem; }
                        .w-12 { width: 3rem; }
                        .whitespace-nowrap { white-space: nowrap; }
                        .justify-between { justify-content: space-between; }
                        .border-t { border-top-width: 1px; }
                        .border-black { border-top-color: black; border-top-style: solid; }
                        .border-gray-200 { border-top-color: #e5e7eb; border-top-style: solid; }
                        .mx-auto { margin-left: auto; margin-right: auto; }
                        .w-4\\/5 { width: 80%; }
                        .text-sm { font-size: 0.875rem; }
                        .text-xs { font-size: 0.75rem; }
                        .font-semibold { font-weight: 600; }
                        .font-medium { font-weight: 500; }
                        .text-gray-500 { color: #6b7280; }
                        .text-gray-700 { color: #374151; }
                        ul.list-disc { margin-left: 1rem; margin-top: 0; }
                        li { margin-bottom: 0.3rem; }
                        @media print {
                            @page { margin: 0; }
                        }
                    </style>
                </head>
                <body>
                    ${finalHtml}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const signatureGridAndFooter = (
        <>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 mt-8 mb-6">
                <div className="flex items-end gap-2">
                    <span className="whitespace-nowrap">Data de retirada</span>
                    <div className="w-8 border-b-black"></div>/
                    <div className="w-8 border-b-black"></div>/
                    <div className="w-12 border-b-black"></div>
                </div>
                <div className="flex items-end gap-2">
                    <span className="whitespace-nowrap">Data de devolução</span>
                    <div className="w-8 border-b-black"></div>/
                    <div className="w-8 border-b-black"></div>/
                    <div className="w-12 border-b-black"></div>
                </div>

                <div className="flex items-end gap-2">
                    <span className="whitespace-nowrap">Usuário</span>
                    <div className="flex-1 border-b-black"></div>
                </div>
                <div className="flex items-end gap-2">
                    <span className="whitespace-nowrap">Usuário</span>
                    <div className="flex-1 border-b-black"></div>
                </div>

                <div className="flex items-end gap-2">
                    <span className="whitespace-nowrap">Gerencia / Supervisão</span>
                    <div className="flex-1 border-b-black"></div>
                </div>
                <div className="flex items-end gap-2">
                    <span className="whitespace-nowrap">Gerencia / Supervisão</span>
                    <div className="flex-1 border-b-black"></div>
                </div>

                <div className="flex items-end gap-2">
                    <span className="whitespace-nowrap">Responsável T.I</span>
                    <div className="flex-1 border-b-black"></div>
                </div>
                <div className="flex items-end gap-2">
                    <span className="whitespace-nowrap">Responsável T.I</span>
                    <div className="flex-1 border-b-black"></div>
                </div>
            </div>

            <div className="text-center text-xs text-gray-500 pt-6 mt-6 border-t border-gray-200">
                <p className="font-bold text-gray-700">CTV COLOMBO</p>
                <p>Rua Einstein, 1042 – Vila Guarani, Colombo – PR - CEP: 83.408-040</p>
                <p>Fone: (41) 3037-4792 | E-mail: contato@netcol.com.br | Site: http://www.netcol.com.br</p>
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 print:static print:inset-auto print:bg-transparent print:p-0 print:block">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 print:max-w-none print:max-h-none print:shadow-none print:block print:overflow-visible relative">
                
                {/* Header que não aparece na impressão */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 print:hidden bg-slate-50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CheckSquare size={18} className="text-purple-600" />
                            Gerar Termos de Responsabilidade
                        </h2>
                        <p className="text-xs text-slate-500">Equipamentos de {func.nome}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                disabled={selectedCelulares.length === 0 && selectedNotebooks.length === 0 && selectedChips.length === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                <Printer size={16} />
                                Imprimir Selecionados
                            </button>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden print:block">
                    {/* Sidebar de Seleção Individual */}
                    <div className="w-72 border-r border-slate-100 p-4 overflow-y-auto bg-white print:hidden">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Selecione o que imprimir:</h3>
                        
                        <div className="space-y-6">
                            {/* Celulares */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <Smartphone size={16} className="text-purple-600" /> Celulares
                                </div>
                                {func.celulares?.map(cel => (
                                    <label key={cel.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedCelulares.includes(cel.id)}
                                            onChange={() => toggleSelection(cel.id, 'cel')}
                                            className="mt-1 rounded border-slate-300 text-purple-600 focus:ring-purple-600"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-slate-800">{cel.modelo_marca}</span>
                                            <span className="text-[10px] text-slate-500">Nº Série: {cel.serial}</span>
                                        </div>
                                    </label>
                                ))}
                                {(!func.celulares || func.celulares.length === 0) && <p className="text-[10px] text-slate-400 italic pl-6">Nenhum vinculado</p>}
                            </div>

                            {/* Notebooks */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <Laptop size={16} className="text-indigo-600" /> Notebooks
                                </div>
                                {func.notebooks?.map(note => (
                                    <label key={note.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedNotebooks.includes(note.id)}
                                            onChange={() => toggleSelection(note.id, 'note')}
                                            className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-slate-800">{note.modelo_marca}</span>
                                            <span className="text-[10px] text-slate-500">Nº Série: {note.serial}</span>
                                        </div>
                                    </label>
                                ))}
                                {(!func.notebooks || func.notebooks.length === 0) && <p className="text-[10px] text-slate-400 italic pl-6">Nenhum vinculado</p>}
                            </div>

                            {/* Chips */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <CreditCard size={16} className="text-pink-600" /> Chips
                                </div>
                                {func.chips?.map(chip => (
                                    <label key={chip.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedChips.includes(chip.id)}
                                            onChange={() => toggleSelection(chip.id, 'chip')}
                                            className="mt-1 rounded border-slate-300 text-pink-600 focus:ring-pink-600"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-slate-800">{chip.numero}</span>
                                            <span className="text-[10px] text-slate-500">Plano: {chip.plano}</span>
                                        </div>
                                    </label>
                                ))}
                                {(!func.chips || func.chips.length === 0) && <p className="text-[10px] text-slate-400 italic pl-6">Nenhum vinculado</p>}
                            </div>
                        </div>
                    </div>

                    {/* Área de Preview */}
                    <div className="flex-1 p-8 overflow-y-auto bg-slate-100 flex flex-col gap-8 print:bg-white print:p-0 print:gap-0">
                        {!temAlgum ? (
                            <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
                                Este funcionário não possui equipamentos vinculados.
                            </div>
                        ) : (
                            <>
                                {/* Preview Selecionados */}
                                {func.celulares?.filter(c => selectedCelulares.includes(c.id)).map(cel => (
                                    <div key={cel.id} id={`termo-celular-${cel.id}`} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-3xl mx-auto w-full text-slate-900 text-[15px] leading-relaxed font-sans print:shadow-none print:border-none print:p-0 print:max-w-none">
                                        <h1 className="text-center font-bold text-lg mb-8 uppercase underline underline-offset-4">
                                            Termo de Responsabilidade de<br />Aparelho Celular Corporativo
                                        </h1>

                                        <p className="mb-4 text-justify">
                                            A empresa CTV COLOMBO LTDA, situada na Rua Einstein, 1042 - Bairro: Vila Guarani, inscrita no CNPJ sob o nº 09.408.974/0001-83 entrega neste ato, o aparelho celular:
                                        </p>

                                        <div className="mb-4 pl-4 font-semibold text-justify">
                                            <p>Modelo: {cel.modelo_marca || 'Não informado'} {cel.armazenamento ? `${cel.armazenamento}` : ''}{cel.memoria ? `, ${cel.memoria} RAM` : ''}{cel.tela ? `, Tela ${cel.tela}` : ''}{cel.processador ? `, Processador ${cel.processador}` : ''}</p>
                                            <p>Número de série: {cel.serial || 'Não informado'}</p>
                                        </div>

                                        <p className="mb-6 text-justify">
                                            com carregador, cabo de carregamento, película e capa de proteção ao funcionário {func.nome} portador do CPF nº {func.cpf} doravante denominado simplesmente "USUÁRIO" sob as seguintes condições:
                                        </p>

                                        <ul className="list-disc pl-6 space-y-4 mb-6 text-justify">
                                            <li>
                                                O equipamento deverá ser utilizado ÚNICA e EXCLUSIVAMENTE a serviço da empresa tendo em vista a atividade a ser exercida pelo USUÁRIO;
                                            </li>
                                            <li>
                                                Ficará o USUÁRIO responsável pelo uso e conservação do equipamento;
                                            </li>
                                            <li>
                                                O USUÁRIO tem somente a DETENÇÃO, tendo em vista o uso exclusivo para prestação de serviços profissionais e NÃO a PROPRIEDADE do equipamento, sendo terminantemente proibido o empréstimo, aluguel ou cessão deste a terceiros;
                                            </li>
                                        </ul>

                                        <h2 className="font-bold mb-3">Cláusula de Uso de Dados Móveis</h2>
                                        
                                        <p className="mb-4 text-justify">
                                            A empresa fornece a cada funcionário um plano de dados por mês para uso relacionado ao trabalho. Este plano de dados é considerado adequado para as necessidades de trabalho mensais.
                                        </p>
                                        
                                        <p className="mb-4 text-justify">
                                            Caso o funcionário esgote o plano de dados dentro do mês e seja necessário adicionar mais dados para continuar o trabalho, qualquer custo associado à adição de dados extras será cobrado do funcionário. A empresa irá notificar o funcionário antes de adicionar mais dados e o custo associado será deduzido do salário do funcionário no próximo ciclo de pagamento.
                                        </p>
                                        
                                        <p className="mb-6 text-justify">
                                            Ao aceitar o telefone celular fornecido pela empresa, o funcionário concorda com esta cláusula de uso de dados móveis.
                                        </p>

                                        <ul className="list-disc pl-6 space-y-4 mb-6 text-justify">
                                            <li>
                                                Ao término da prestação de serviço ou do contrato individual de trabalho, o USUÁRIO compromete-se a devolver o equipamento em perfeito estado no mesmo dia em que for comunicado ou comunique seu desligamento ao setor T.I, considerando o desgaste natural pelo uso normal do equipamento;
                                            </li>
                                            <li>
                                                Fica proibido o uso do aparelho para envio de mensagens de texto, navegação na internet e ligações que não sejam entre números da empresa. Ligações para outros números devem ser feitas de forma a cobrar. Caso contrário será cobrado o valor estipulado pela fatura no fim do mês mais uma taxa de R$ 39,90;
                                            </li>
                                            <li>
                                                Se o equipamento for danificado ou inutilizado por emprego inadequado, mau uso, negligência ou extravio, a empresa cobrará o valor de um equipamento da mesma marca ou equivalente ao da praça. Valor este estipulado em R$ 830,00 reais;
                                            </li>
                                        </ul>

                                        <p className="mb-10 font-medium">
                                            Declaro estar ciente e de acordo com as cláusulas acima.
                                        </p>

                                        {signatureGridAndFooter}
                                    </div>
                                ))}

                                {func.notebooks?.filter(n => selectedNotebooks.includes(n.id)).map(note => (
                                    <div key={note.id} id={`termo-notebook-${note.id}`} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-3xl mx-auto w-full text-slate-900 text-[15px] leading-relaxed font-sans print:shadow-none print:border-none print:p-0 print:max-w-none">
                                        <h1 className="text-center font-bold text-lg mb-8 uppercase underline underline-offset-4">
                                            Termo de Responsabilidade<br />De Notebook e Acessório
                                        </h1>

                                        <p className="mb-4 text-justify">
                                            A empresa CTV COLOMBO LTDA, situada na Rua Einstein, 1042 - Bairro: Vila Guarani, inscrita no CNPJ sob o nº 09.408.974/0001-83 entrega neste ato, um notebook, 
                                        </p>

                                        <div className="mb-4 pl-4 font-semibold text-justify">
                                            <p>Modelo: {note.modelo_marca || 'Não informado'} {note.hd ? `SSD/HD ${note.hd}` : ''}{note.memoria ? `, ${note.memoria} de Ram` : ''}{note.processador ? ` e Processador ${note.processador}` : ''}</p>
                                            <p>Número de série: {note.serial || 'Não informado'}</p>
                                        </div>

                                        <p className="mb-6 text-justify">
                                            e fonte universal inclusa ao funcionário {func.nome} portador do CPF nº {func.cpf}, doravante denominado simplesmente "USUÁRIO" sob as seguintes condições:
                                        </p>

                                        <ul className="list-disc pl-6 space-y-4 mb-6 text-justify">
                                            <li>
                                                O equipamento deverá ser utilizado ÚNICA e EXCLUSIVAMENTE a serviço da empresa tendo em vista a atividade a ser exercida pelo USUÁRIO;
                                            </li>
                                            <li>
                                                Ficará o USUÁRIO responsável pelo uso e conservação do equipamento;
                                            </li>
                                            <li>
                                                O USUÁRIO tem somente a DETENÇÃO, tendo em vista o uso exclusivo para prestação de serviços profissionais e NÃO a PROPRIEDADE do equipamento, sendo terminantemente proibido o empréstimo, aluguel ou cessão deste a terceiros;
                                            </li>
                                            <li>
                                                Ao término da prestação de serviço ou do contrato individual de trabalho, o USUÁRIO compromete-se a devolver o equipamento em perfeito estado no mesmo dia em que for comunicado ou comunique seu desligamento ao setor de T.I, considerando o desgaste natural pelo uso normal do equipamento;
                                            </li>
                                            <li>
                                                Se o equipamento for danificado ou inutilizado por emprego inadequado, mau uso, negligência ou extravio, a empresa cobrará o valor de um equipamento da mesma marca ou equivalente ao da praça. Valor este estipulado em R$ 1.300,00;
                                            </li>
                                        </ul>

                                        <p className="mb-10 font-medium pt-4">
                                            Declaro estar ciente e de acordo com as cláusulas acima.
                                        </p>

                                        {signatureGridAndFooter}
                                    </div>
                                ))}

                                {func.chips?.filter(c => selectedChips.includes(c.id)).map(chip => (
                                    <div key={chip.id} id={`termo-chip-${chip.id}`} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-3xl mx-auto w-full text-slate-900 text-[15px] leading-relaxed font-sans print:shadow-none print:border-none print:p-0 print:max-w-none">
                                        <h1 className="text-center font-bold text-lg mb-8 uppercase underline underline-offset-4">
                                            Termo de Responsabilidade de<br />Chip Celular Corporativo
                                        </h1>

                                        <p className="mb-4 text-justify">
                                            A empresa CTV COLOMBO LTDA, situada na Rua Einstein, 1042 - Bairro: Vila Guarani, inscrita no CNPJ sob o nº 09.408.974/0001-83 entrega neste ato, o chip de celular:
                                        </p>

                                        <div className="mb-4 pl-4 font-semibold text-justify">
                                            <p>Número: {chip.numero || 'Não informado'}</p>
                                        </div>

                                        <p className="mb-6 text-justify">
                                            ao funcionário {func.nome} portador do CPF nº {func.cpf} doravante denominado simplesmente "USUÁRIO" sob as seguintes condições:
                                        </p>

                                        <ul className="list-disc pl-6 space-y-4 mb-6 text-justify">
                                            <li>
                                                O chip deverá ser utilizado ÚNICA e EXCLUSIVAMENTE a serviço da empresa tendo em vista a atividade a ser exercida pelo USUÁRIO;
                                            </li>
                                            <li>
                                                Ficará o USUÁRIO responsável pelo uso e conservação do chip;
                                            </li>
                                            <li>
                                                O USUÁRIO tem somente a DETENÇÃO, tendo em vista o uso exclusivo para prestação de serviços profissionais e NÃO a PROPRIEDADE do chip, sendo terminantemente proibido o empréstimo, aluguel ou cessão deste a terceiros;
                                            </li>
                                        </ul>

                                        <h2 className="font-bold mb-3">Cláusula de Uso de Dados Móveis</h2>
                                        
                                        <p className="mb-4 text-justify">
                                            A empresa fornece a cada funcionário um plano de dados de {chip.plano || '6GB'} por mês para uso relacionado ao trabalho. Este plano de dados é considerado adequado para as necessidades de trabalho mensais.
                                        </p>
                                        
                                        <p className="mb-4 text-justify">
                                            Caso o funcionário esgote o plano de {chip.plano || '6GB'} dentro do mês e seja necessário adicionar mais dados para continuar o trabalho, qualquer custo associado à adição de dados extras será cobrado do funcionário. A empresa irá notificar o funcionário antes de adicionar mais dados e o custo associado será deduzido do salário do funcionário no próximo ciclo de pagamento.
                                        </p>
                                        
                                        <p className="mb-6 text-justify">
                                            Ao aceitar o chip celular fornecido pela empresa, o funcionário concorda com esta cláusula de uso de dados móveis.
                                        </p>

                                        <ul className="list-disc pl-6 space-y-4 mb-6 text-justify">
                                            <li>
                                                Ao término da prestação de serviço ou do contrato individual de trabalho, o USUÁRIO compromete-se a devolver o equipamento em perfeito estado no mesmo dia em que for comunicado ou comunique seu desligamento ao setor T.I;
                                            </li>
                                            <li>
                                                Fica proibido o uso para envio de mensagens de texto, navegação na internet e ligações que não sejam entre números da empresa. Ligações para outros números devem ser feitas de forma a cobrar. Caso contrário será cobrado o valor estipulado pela fatura no fim do mês mais uma taxa de R$ 39,90;
                                            </li>
                                            <li>
                                                Se o chip for danificado ou inutilizado por emprego inadequado, mau uso, negligência ou extravio, a empresa cobrará o valor de um equipamento da mesma marca ou equivalente ao da praça. Valor este estipulado em R$ 30,00 reais;
                                            </li>
                                        </ul>

                                        <p className="mb-10 font-medium">
                                            Declaro estar ciente e de acordo com as cláusulas acima.
                                        </p>

                                        {signatureGridAndFooter}
                                    </div>
                                ))}

                                {(selectedCelulares.length === 0 && selectedNotebooks.length === 0 && selectedChips.length === 0) && (
                                    <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
                                        Nenhum equipamento selecionado para preview ou impressão.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
