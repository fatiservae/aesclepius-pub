use serde::{Deserialize, Serialize};
use std::env;
use std::fs::{File, OpenOptions};
use std::io::{Read, Seek, SeekFrom, Write};
use promptly::{prompt, /*prompt_default,*/ prompt_opt};
use colored::*;

#[derive(Serialize, Deserialize)]
struct Questao {
  prova: String,
  banca: String,
  ano: u32,
  tipo: String,
  #[serde(skip_serializing_if = "Option::is_none")]
  texto_base: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  alternativas: Option<Vec<String>>,
  questao: String,
  #[serde(skip_serializing_if = "Option::is_none")]
  resposta_bool: Option<bool>,
  #[serde(skip_serializing_if = "Option::is_none")]
  resposta_multipla: Option<usize>,
  #[serde(skip_serializing_if = "Option::is_none")]
  imagem: Option<String>
}

fn main() -> Result<(), Box<dyn std::error::Error>>{
  let args: Vec<String> = env::args().collect();
  if args.len() < 2 {
    eprintln!("Forneça o nome do arquivo JSON como argumento.");
  }
  let filename = &args[1];
  let mut data = if let Ok(mut file) = File::open(filename) {
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    serde_json::from_str::<Vec<Questao>>(&contents)
        .unwrap_or_default()
  } else {
    Vec::new()
  };

  // Banca, Ano, Texto base
  let banca: String = prompt(format!("{}", "Banca".blue()))?;
  let ano: u32 = prompt(format!("{}", "Ano".blue()))?;
  let prova: String = prompt(format!("{}", "Prova".blue()))?;
  let mut texto_base: Option<String> = None;
  let mut imagem: Option<String> = None;

  loop{
    // Texto Base
    let texto_base_bak: String = match texto_base {
      Some(texto) => texto.replace("\n", " ").replace("  ", " "),
      None => {
        println!("{}", "Atenção, texto base vazio!".red());
        "".to_string()
      }
    };
    texto_base = match prompt_opt::<String, String>(format!("{}", "Texto base".blue()))? {
      Some(texto) => match texto.as_str() {
        "r" | "R" => Some(texto_base_bak),
        _ => Some(texto.replace("\n", " ").replace("  ", " "))
      },
      None => None
    };

    // Tipo e alternativas
    let mut tipo: String = prompt(format!("{}", "Tipo".blue()))?;
    let alternativas: Option<Vec<String>>;
    let mut alternativas_length: usize = 0;
    match tipo.as_str() {
      "me" => {
        let alternativas_prompt: String = 
          prompt(format!("{}", "Alternativas separadas por //".blue()))?;
        alternativas = Some(alternativas_prompt.trim()
          .replace("\n", " ")
          .replace("  ", " ")
          .split("//")
          .map(String::from)
          .collect());
        alternativas_length = match alternativas {
          Some(ref lista_alternativas) => { 
              lista_alternativas.len()
          },
          None => 0
        };
      },
      _ => {
        alternativas = None;
      }
    };
    
    // Questão
    let mut questao: String = prompt(format!("{}", "Questão".blue()))?;
    //let mut questao: String = prompt("\x1b[93mError\x1b[0m")?;
    questao = questao.replace("\n", " ").replace("  ", " ");

    // Resposta
    let mut resposta_multipla: Option<usize> = None;
    let mut resposta_bool: Option<bool> = None;
    match tipo.as_str() {
      "me" => {
        resposta_multipla = Some(prompt::<usize, &str>
          (format!("{}", "Entre o index da alternativa certa".blue()).as_str())?);
        match resposta_multipla {
          Some(num) if num > alternativas_length - 1 => {
            println!("Index além do no. de alternativas. Usando {}", alternativas_length - 1)
          },
          _ => {} 
        }
      },
      _ => { 
        resposta_bool = match prompt::<String, String>
           (format!("{}", "Verdadeiro ou falso?".green()))?
           .as_str() {
          "v" | "verdadeiro" | "true" | "certo" | "c"  => {
              Some(true)
          },
          _ => Some (false)
         }    
      }
    };
    match tipo.as_str() {
      "me" => tipo = "multipla_escolha".to_string(),
      _ => tipo = "verdadeiro_falso".to_string()
    };

    // Imagem
    let imagem_bak: String = match imagem {
      Some(imagem) => imagem,
      //Some(imagem) => imagem.replace("\n", " ").replace("  ", " "),
      None => {
        println!("{}", "Atenção, sem imagem!".red());
        "".to_string()
      }
    };
    imagem = match prompt_opt::<String, String>(format!("{}", "Imagem".blue()))? {
      Some(imagem) => match imagem.as_str() {
        "r" | "R" => Some(imagem_bak),
        _ => Some(imagem)
      },
      None => None
    };

    // Adicionando questão 
    let new_entry = Questao {
      prova: prova.clone(),
      banca: banca.clone(),
      ano,
      texto_base: texto_base.clone(),
      tipo,
      alternativas,
      questao,
      resposta_bool,
      resposta_multipla,
      imagem: imagem.clone()
    };

    // Cancelar se erro
    let erro: Option<String> = prompt_opt(
            format!("{}", "Entre 'x' se houve erro para eliminar a questão".blue()))?;
    match erro {
      Some(answer) if matches!(
        answer.as_str(), 
        "x"
        ) => (),
      Some(_) | None => {
        data.push(new_entry);
        // Serializando e escrevendo 
        let json_data = serde_json::to_string_pretty(&data)?;
        let mut file = OpenOptions::new()
            .write(true)
            .create(true)
            .open(filename)?;
        file.seek(SeekFrom::Start(0))?;
        file.write_all(json_data.as_bytes())?;
        println!("{}", "Entrada adicionada com sucesso!".green());
      },
    };

    // Entrar outra questão ou sair
    let continued: Option<String> = prompt_opt(format!("{}", "Continuar?".yellow()))?;
    match continued {
      Some(answer) if matches!(
        answer.as_str(), 
        "y" | "yes" | "sim" | "s" | "") => (),
      Some(_) => break Ok(()),
      None => ()
    };
  }
}
