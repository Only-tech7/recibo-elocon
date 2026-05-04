        // FUNÇÕES AUXILIARES

  // Toast
  function mostrarToast(mensagem, tipo = "erro") {
    const toast = document.getElementById("toast");

    toast.innerText = mensagem;

    toast.classList.remove("success");

    if (tipo === "success") {
        toast.classList.add("success");
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
// Formatar moeda
function formatarMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
// Número por extenso (simples)
function numeroPorExtenso(valor) {
    valor = parseFloat(valor);

    if (isNaN(valor)) return "";

    const inteiro = Math.floor(valor);
    const decimal = Math.round((valor - inteiro) * 100);

    const unidades = ["","um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
   const dezenas = ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    const especiais = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

    function converter(n) {
        if (n === 0) return "zero";
        if (n === 100) return "cem";

        let c = Math.floor(n / 100);
        let d = Math.floor((n % 100) / 10);
        let u = n % 10;

        let texto = "";

        if (c > 0) texto += centenas[c];

        if (d === 1) {
            texto += (texto ? " e " : "") + especiais[u];
        } else {
            if (d > 0) texto += (texto ? " e " : "") + dezenas[d];
            if (u > 0) texto += (texto ? " e " : "") + unidades[u];
        }
        return texto;
    }

    let resultado = converter(inteiro) + (inteiro === 1 ? " real " : " reais ");

    if (decimal > 0) {
        resultado += " e " + converter(decimal) + (decimal === 1 ? " centavo" : " centavo");
    }
        return resultado;

   }
// Validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length != 11) return false;

    // eliminar cpf's inválidos 
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma= 0;
    let resto;

    //1º digito
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1,i)) * (11- i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    // 2º digito
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }

    resto = (soma * 10) %11;
    if (resto === 10 ||resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// UX (FOCO + ERRO)
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => {
    
        document.querySelectorAll(".section").forEach(sec => {
            sec.classList.remove("active");
        });
        const section = input.closest (".section");
        if (section) {
            section.classList.add("active");
        }
});
    });

    document.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => {
                if (input.value.trim() !== "") {
                    input.classList.remove("erro");
                }
            });
        });

        // MÁSCARA + VALIDAÇÃO CPF

        // máscara CPF/CNPJ
        document.getElementById('cpf').addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '');

    if (v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        v = v.replace(/(\d{2})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1/$2')
             .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }

    e.target.value = v;
});

document.getElementById("cpf").addEventListener("blur", function () {
    const cpf = this.value

    if (cpf && !validarCPF(cpf)) {
        this.classList.add("erro");
        mostrarToast("CPF inválido!");
    } else {
        this.classList.remove("erro");
    }
});

// VALIDAÇÃO GERAL
function validarCampos() {
    const campos = [
        'nome', 'cpf','pix', 'banco', 'agencia', 'conta', 'tipo',
        'nomeRecebedor', 'cpfRecebedor', 'valor', 'data', 'data'
    ];

    let valido = true;

    campos.forEach(id => {
        const campo = document.getElementById(id);

        if (!campo || !campo.value.trim()) {
            if (campo) campo.classList.add("erro");
            valido = false;
        }

    });

    const consorcio = document.querySelectorAll(".consorcio-item");

    consorcio.forEach(item => {
        const grupo = item.querySelector(".grupo");
        const cota = item.querySelector(".cota");
        const contrato = item.querySelector(".contrato");

        if(!grupo.value.trim() || !cota.value.trim() || !contrato.value.trim()) {
            grupo.classList.add("erro");
            cota.classList.add("erro");
            contrato.classList.add("erro");
            valido = false;
        }
    });

    if (!valido) {
        mostrarToast("Preencha todos os campos obrigatórios!");

        const primeiroErro = document.querySelector(".erro");
        if (primeiroErro) {
            primeiroErro.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            primeiroErro.focus();
        }
        return false;
    }

    const cpfInput = document.getElementById('cpf');
    if (!validarCPF(cpfInput.value)) {
        cpfInput.classList.add("erro");
        mostrarToast("CPF inválido!");
        cpfInput.focus();
        return false;
    }

    return true;
}

function formatarData(dataISO) {
    const data = new Date(dataISO);

    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}
   
    function adicionarConsorcio() {
        const container = document.getElementById("listaConsorcios");

        const novo = document.createElement("div");
        novo.classList.add("grid", "consorcio-item");

        novo.innerHTML = `
        <div class="form-group">
        <label>Grupo:</label>
        <input type="text" class="grupo">
        </div>

         <div class="form-group">
        <label>Cota:</label>
        <input type="text" class="cota">
        </div>

         <div class="form-group">
        <label>Contrato:</label>
        <input type="text" class="contrato">
        </div>
    `;

        container.appendChild(novo);
}


        window.gerarWord = async function () {

        const btn = document.getElementById('btnGerar');
        const text = document.getElementById("btnText");
            const dataInput = document.getElementById("data").value;
            const dataFormatada = formatarData(dataInput);


        btn.classList.add("loading");
        text.innerText = "Gerando...";

            if (!validarCampos()) {
                btn.classList.remove("loading");
                text.innerText = "Gerar Recibo Word";
                return;
            }

            const { Document, Packer, Paragraph, TextRun } = window.docx;

            const valorInput = document.getElementById("valor").value;
            const valorFormatado = formatarMoeda(valorInput);
            const valorExtenso = numeroPorExtenso(valorInput);

            const doc = new Document({
                sections: [{
                    children: [

                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "RECIBO ELOCON",
                                    bold: true,
                                    size: 36
                                })
                            ],
                            alignment: "center"
                        }),

                        new Paragraph(""),

                        new Paragraph({
                            children: [
                                new TextRun("Eu "),
                                new TextRun({
                                    text: document.getElementById("nome").value,
                                    bold: true
                                }),

                                new TextRun(", inscrito no CPF/CNPJ "),
                                new TextRun({
                                    text: document.getElementById("cpf").value,
                                    bold: true
                                }),
                                new TextRun(`, declaro haver recebido da empresa ELOCON CONSÓRCIOS ESTRATÉGICOS LTDA, inscrita no CNPJ sob o nº: 44.040.456/0001-50, com sede na Rua dos Timbiras – nº: 1936 – Sala 1503 – Bairro Lourdes – Belo Horizonte – MG, Cep: 30140-069, a importância mencionada de ${valorFormatado} (${valorExtenso}), referente a cessão que lhe faço nesta data de todos os meus direitos creditórios sobre a(s) cota(s) de consórcio do(s) grupo(s) administrado(s) pela Ademicon Administradora de Consórcios S/A., abaixo especificada(s):`)
                            ]
                        }),

                        new Paragraph(""),

                        new Paragraph(`Grupo: ${document.getElementById("grupo").value} | Cota: ${document.getElementById("contrato").value}`),
                        
                          new Paragraph(""),

    //AQUI entram os dados bancários (o que vc mandou)

    new Paragraph({
        children: [
            new TextRun ({
              text: "Chave PIX: ",
              size: 22
            }),
            new TextRun({
                text: document.getElementById("pix").value,
                bold: true,
                size: 22
            })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({
            text: "Banco: ",
            size: 22
            }),
            new TextRun({
                text: document.getElementById("banco").value,
                bold: true,
                size: 22
            })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({
            text: "Agência: ",
            size: 22
    }),
            new TextRun({
                text: document.getElementById("agencia").value,
                bold: true,
                size: 22
            })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({
            text: "Conta: ",
            size: 22
    }),
            new TextRun({
                text: document.getElementById("conta").value,
                bold: true,
                size: 22
            })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({
                text: "Tipo: ",
                size: 22
            }),
            new TextRun({
                text: document.getElementById("tipo").value,
                bold: true,
                size: 22
            })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({
            text: "Nome: ",
            size: 22
            }),
            new TextRun({
                text: document.getElementById("nomeRecebedor").value,
                bold: true,
                size: 22
            })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({
            text: "CPF/CNPJ: ",
                size: 22
            }),
            new TextRun({
                text: document.getElementById("cpfRecebedor").value,
                bold: true,
                size: 22
            })
        ]
        
    }),     

                    new Paragraph (""),

                    new Paragraph ("Pelo presente recibo dou plena, rasa e irrevogável quitação em relação a importância recebida, como sendo a justa e combinada, nada mais tendo a reclamar, sob qualquer pretexto, em razão do negócio celebrado."),
                    
                    new Paragraph(""),

                    new Paragraph ("Integra a presente negociação, procuração pública outorgada pelo(a) consorciado(a) cedente dando poderes para a ELOCON CONSÓRCIOS ESTRATÉGICOS LTDA representá-lo(a) perante a Ademicon Administradora de Consórcios S/A. para, em especial, vender, ceder ou transferir para o seu próprio nome ou a quem convier a(s) cota(s) de consórcio objeto da presente negociação ou receber todos e quaisquer valores de créditos referente(s) a(s) cota(s) objeto da presente negociação."),

                    new Paragraph(""),

                    new Paragraph ("Por fim, declaro que a(s) cota(s) de consórcio objeto da presente negociação NUNCA foi (foram) objeto de qualquer outra negociação. A presente declaração é feita sob as penas da Lei, ciente que a falsa declaração importa em responsabilidade criminal nos termos do artigo 299 do Código Penal Brasileiro."),

                    new Paragraph(""),

                        new Paragraph(""),

                        new Paragraph(`Belo Horizonte - MG, ${dataFormatada}.`),

                        new Paragraph(""),
                        new Paragraph("__________________________________"),
                        new Paragraph("Assinatura")
                    ]
                    
                }]
            });

        //const campos = ['nome', 'cpf', 'grupo', 'cota', 'contrato', 'pix',
             //'banco', 'agencia', 'conta', 'tipo', 'nomeRecebedor', 'cpfRecebedor', 'valor'];
             //let valido = true;
            // campos.forEach(id => {
            //     const campo = document.getElementById(id);

             // if (!campo || !campo.value.trim()) {

               //   if (campo) {
                 //    campo.classList.add("erro");
                   //   }

                     //  valido = false;

                    // } else {
                      //campo.classList.remove("erro");
                      // }
                      //  });
            // if(!valido) {
              //  mostrarToast("Preencha todos os campos obrigatórios!");
  
    const blob = await Packer.toBlob(doc);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "recibo-elocon.docx";
    a.click();

    btn.classList.remove("loading");
    text.innerText = "Gerar Recibo Word";
}

window.gerarPDF = function () {

   // const campos = ['nome', 'cpf', 'grupo', 'cota', 'contrato', 'pix',
     //  'banco', 'agencia', 'conta', 'tipo', 'nomeRecebedor', 'cpfRecebedor', 'valor'];

     //   let valido = true;

      //  campos.forEach(id => {
        //    const campo = document.getElementById(id);

          //  if(!campo || !campo.value.trim()) {
            //    if (campo) campo.classList.add("erro");
              //  valido = false;
           // } else {
            //    campo.classList.remove("erro")
           // }
       // });

       // if(!valido) {
         //   mostrarToast("Preencha todos os campos obrigatórios!");

           // const primeiroErro = document.querySelector(".erro");
           // if (primeiroErro) {
          //  primeiroErro.scrollIntoView({
             //   behavior: "smooth",
               // block: "center"
           // });
           // primeiroErro.focus();
            //}
           // return;
       // }

        //validação de CPF
       // const cpfInput = document.getElementById('cpf');
      //  if(cpfInput && !validarCPF(cpfInput.value)) {
       //     cpfInput.classList.add("erro");
         //   mostrarToast("CPF inválido!");
         //   cpfInput.scrollIntoView({
          //      behavior:"Smooth",
           //     block: "center"
          //  });
          //  cpfInput.focus();

          //  return;
       // }

       if(!validarCampos()) return; 
       
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    //MARCA D'ÁGUA
    doc.setTextColor(220, 220, 220); // cinza claro
    doc.setFontSize(60);
    doc.text("ELOCON", 105, 160, {
        align: "center",
        angle: 45
    });

    // volta cor normal
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
        
          const valorInput = document.getElementById("valor").value;
        const valorFormatado = formatarMoeda(valorInput);
        const valorExtenso = numeroPorExtenso(valorInput);
        const dataInput = document.getElementById("data").value;
            const dataFormatada = formatarData(dataInput);


    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    /*const grupo = document.getElementById("grupo").value;
    const cota = document.getElementById("cota").value;
    const contrato = document.getElementById("contrato").value;*/
    const consorcios = document.querySelectorAll(".consorcio-item");
    const telefone = document.getElementById("telefone").value;
    const administradora = document.getElementById("administradora").value;
    const cidadeCartorio = document.getElementById("cidadeCartorio").value

    const pix = document.getElementById("pix").value;
    const banco = document.getElementById("banco").value;
    const agencia = document.getElementById("agencia").value;
    const conta = document.getElementById("conta").value;
    const tipo = document.getElementById("tipo").value;
    const nomeRecebedor = document.getElementById("nomeRecebedor").value;
    const cpfRecebedor = document.getElementById("cpfRecebedor").value;


    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`RECIBO - ${valorFormatado}`, 105, y, { align: "center"});

    y += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Eu ${nome}, inscrito no CPF/CNPJ ${cpf},`, 20, y);
    y += 5;
        const textoPrincipal = `declaro haver recebido da empresa ELOCON CONSÓRCIOS ESTRATÉGICOS LTDA, inscrita no CNPJ sob o nº: 44.040.456/0001-50, com sede na Rua dos Timbiras – nº: 1936 – Sala 1503 – Bairro Lourdes – Belo Horizonte – MG, Cep: 30140-069, a importância mencionada de ${valorFormatado} (${valorExtenso}), referente a cessão que lhe faço nesta data de todos os meus direitos creditórios sobre a(s) cota(s) de consórcio do(s) grupo(s) administrado(s) pela ${administradora}., abaixo especificada(s):`;

        const linhas = doc.splitTextToSize(textoPrincipal, 170);
        doc.text(linhas, 20, y);

        y += linhas.length * 5;

    y += 10;

   // doc.text(`Grupo: ${grupo}  |  Cota: ${cota}  |  Contrato: ${contrato}`, 20, y);

        consorcios.forEach((item, index) => {
            const grupo = item.querySelector(".grupo").value;
            const cota = item.querySelector(".cota").value;
            const contrato = item.querySelector(".contrato").value;

            const linha = `Grupo: ${grupo} | Cota: ${cota} | Contrato: ${contrato}`;

            const linhas = doc.splitTextToSize(linha, 170);

            if (y + (linhas.length * 5) > 280) {
                doc.addPage();
                y = 20;
            }

            doc.text(linhas, 20, y);
            y += linhas.length * 5;
            y+= 5;
        });

    y += 0;

    doc.text(`Chave PIX: ${pix}`, 20, y);
    y += 5;
    doc.text(`Banco: ${banco}`, 20, y);
    y += 5;
    doc.text(`Agência: ${agencia}`, 20, y);
    y += 5;
    doc.text(`Conta: ${conta}`, 20, y);
    y += 5;
    doc.text(`Tipo: ${tipo}`, 20, y);
    y += 5;
    doc.text(`Nome: ${nomeRecebedor}`, 20, y);
    y += 5;
    doc.text(`CPF/CNPJ: ${cpfRecebedor}`, 20, y);

    y += 10;

//doc.text("Pelo presente recibo dou plena, rasa e irrevogável quitação em relação a importância recebida,", 20, y);
//y += 7;
const textoQuitacao = "Pelo presente recibo dou plena, rasa e irrevogável quitação em relação a importância recebida, como sendo a justa e combinada, nada mais tendo a reclamar, sob qualquer pretexto, em razão do negócio celebrado.";

const linhasQuitacao = doc.splitTextToSize(textoQuitacao, 170);

// quebra de página correta
if (y + (linhasQuitacao.length * 5) > 280) {
    doc.addPage();
    y = 15;
}

doc.text(linhasQuitacao, 20, y);

y += linhasQuitacao.length * 5;
y += 5;



const textoDeclaracao = "Integra a presente negociação, procuração pública outorgada pelo(a) consorciado(a) cedente dando poderes para a ELOCON CONSÓRCIOS ESTRATÉGICOS LTDA representá-lo(a) perante a Ademicon Administradora de Consórcios S/A. para, em especial, vender, ceder ou transferir para o seu próprio nome ou a quem convier a(s) cota(s) de consórcio objeto da presente negociação ou receber todos e quaisquer valores de créditos referente(s) a(s) cota(s) objeto da presente negociação.";

const linhasDeclaracao = doc.splitTextToSize(textoDeclaracao, 170);
doc.text(linhasDeclaracao, 20, y);

y += linhasDeclaracao.length * 4;
y += 7;

const textoProcuracao = "Por fim, declaro que a(s) cota(s) de consórcio objeto da presente negociação NUNCA foi (foram) objeto de qualquer outra negociação. A presente declaração é feita sob as penas da Lei, ciente que a falsa declaração importa em responsabilidade criminal nos termos do artigo 299 do Código Penal Brasileiro.";

const linhasProcuracao = doc.splitTextToSize(textoProcuracao, 170);
doc.text(linhasProcuracao, 20, y);

y += linhasProcuracao.length * 5;
y += 5;

//doc.text(`Belo Horizonte - MG, ${dataFormatada}.`, 20, y);
doc.text(`${cidadeCartorio}, ${dataFormatada}. `, 20, y);

y += 12;

// verifica se tem espaço antes da assinatura
if (y > 250) {
    doc.addPage();
    y = 15;
}
    
    doc.text("__________________________________________", 20, y);
    y += 7;
    doc.text(nome, 20, y);
    y += 5;
    doc.text(`CPF/CNPJ: ${cpf}`, 20, y);
    y += 5;
    doc.text(`Telefone: ${telefone}`, 20, y);

    doc.save("recibo-elocon.pdf");
}

/*function mostrarToast(mensagem, tipo = "erro") {
    const toast = document.getElementById("toast");

    toast.innerText = mensagem;
    toast. classListe.remove("success")

    toast.classList.add("add");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000)
}


 
function numeroPorExtenso(valor) {
    return valor + "reais";
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length != 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

document.querySelectorAll("input").forEach(input => {

    input.addEventListener("focus", () => {
        document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));

        const section = input.closest(".section");
        if (section) section.classList.add("active");
    });

    input.addEventListener("input", () => {
        if (input.value.trim() !== "") {
            input.classList.remove("erro");
        }
    });

});


// máscara CPF/CNPJ
document.getElementById('cpf').addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '');

    if (v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        v = v.replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }

    e.target.value = v;
});


// valida CPF ao sair do campo
document.getElementById("cpf").addEventListener("blur", function () {
    const cpf = this.value;

    if (cpf && !validarCPF(cpf)) {
        this.classList.add("erro");
        mostrarToast("CPF inválido!");
    } else {
        this.classList.remove("erro");
    }
}); */
