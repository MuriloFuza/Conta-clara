# UNIR Conta Clara

> **Note**: O código completo está na branch *completed* com instruções para execução local

UNIR Conta Clara é um mini app web de finanças desenvolvido especialmente para estudantes da UNIR (Universidade Federal de Rondônia) que desejam manter suas finanças pessoais organizadas. Com o UNIR Conta Clara, você pode facilmente registrar suas entradas e saídas de dinheiro em reais, além de acompanhar um dashboard intuitivo que apresenta uma visão clara dos seus gastos. Com recursos simples e eficientes, o UNIR Conta Clara permite que você tenha um controle total sobre suas finanças, ajudando a tomar decisões inteligentes e alcançar uma vida financeira equilibrada. Mantenha suas finanças em ordem enquanto se concentra nos seus estudos com o UNIR Conta Clara.

## Casos de Uso

- Cadastrar uma nova transação
  - Campos necessários
    - ID (UUID)
    - Descrição (Text)
    - Valor (Integer (centavos))
    - Tipo (Débito ou Crédito)
    - Data da Transação (Timestamp)

- Recuperar todas as transações
  - Ordenar por data da transação mais recente
  - Ordenar por valor

- Recuperar transações de um mês específico
  - Ordenar por data da transação mais recente
  - Ordenar por valor
  - Retornar saldo

- Deletar uma transação
  - Recuperar pelo ID

- Atualizar transação (desafio)
  - Recuperar por ID
  - Campos atualizáveis
    - Descrição (Text)
    - Valor (Integer (centavos))
    - Tipo (Débito ou Crédito)
