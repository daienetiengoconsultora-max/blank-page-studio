-- 1) Clientes: tipo PF / PJ
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS client_type text NOT NULL DEFAULT 'PF';
COMMENT ON COLUMN public.leads.client_type IS 'PF = pessoa fisica, PJ = pessoa juridica';

-- 2) Administradoras oficiais (taxas em branco ate confirmacao comercial)
INSERT INTO public.partners (owner_id, name, category, website, notes)
SELECT p.user_id, v.name, 'Administradora', v.website, NULL
FROM public.profiles p
CROSS JOIN (VALUES
  ('Embracon', 'https://www.embracon.com.br/'),
  ('Banco do Brasil', 'https://www.bb.com.br/'),
  ('CNP Consórcio', 'https://www.cnp.com.br/'),
  ('Rodobens', 'https://rodobens.com.br/'),
  ('Magalu Consórcios', 'https://consorciomagalu.com.br/'),
  ('Itaú Consórcios', 'https://www.itau.com.br/consorcio/')
) AS v(name, website)
WHERE p.role = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM public.partners x
    WHERE lower(x.name) = lower(v.name) AND x.owner_id = p.user_id
  );

-- 3) Taxas de referencia publicadas pelo Banco Central do Brasil
INSERT INTO public.rate_references (category, institution, modality, monthly_rate, annual_rate, reference_period, source, source_url, position)
SELECT v.category, v.institution, v.modality, v.monthly_rate, v.annual_rate, v.reference_period,
       'Banco Central do Brasil', 'https://www.bcb.gov.br/estabilidadefinanceira/taxajuros', v.position
FROM (VALUES
  ('imobiliario', 'CAIXA ECONOMICA FEDERAL', 'Financiamento imobiliário com taxas de mercado - Prefixado', 0.87, 10.94, 'Set-2026', 1),
  ('imobiliario', 'BCO XP S.A.', 'Financiamento imobiliário com taxas de mercado - Prefixado', 1.14, 14.57, 'Set-2026', 2),
  ('imobiliario', 'BCO SANTANDER (BRASIL) S.A.', 'Financiamento imobiliário com taxas de mercado - Prefixado', 1.17, 15.04, 'Set-2026', 3),
  ('imobiliario', 'APE POUPEX', 'Financiamento imobiliário com taxas de mercado - Prefixado', 1.43, 18.62, 'Set-2026', 4),
  ('imobiliario', 'BCO DO ESTADO DO RS S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.75, 9.39, 'Set-2026', 1),
  ('imobiliario', 'BANCO BARI S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.76, 9.53, 'Set-2026', 2),
  ('imobiliario', 'BCO BANESTES S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.85, 10.72, 'Set-2026', 3),
  ('imobiliario', 'BANCO SICOOB S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.86, 10.79, 'Set-2026', 4),
  ('imobiliario', 'BCO DO EST. DO PA S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.87, 10.92, 'Set-2026', 5),
  ('imobiliario', 'BCO DO EST. DE SE S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.88, 11.12, 'Set-2026', 6),
  ('imobiliario', 'BANCO COOPERATIVO SICREDI', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.92, 11.56, 'Set-2026', 7),
  ('imobiliario', 'CAIXA ECONOMICA FEDERAL', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.95, 12.05, 'Set-2026', 8),
  ('imobiliario', 'ITAÚ UNIBANCO S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.96, 12.14, 'Set-2026', 9),
  ('imobiliario', 'BCO BRADESCO S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.97, 12.24, 'Set-2026', 10),
  ('imobiliario', 'BCO SANTANDER (BRASIL) S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 0.97, 12.31, 'Set-2026', 11),
  ('imobiliario', 'BANCO INTER', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 1.02, 12.91, 'Set-2026', 12),
  ('imobiliario', 'BCO DO BRASIL S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR', 1.13, 14.49, 'Set-2026', 13),
  ('imobiliario', 'BANCO SEMEAR', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em IPCA', 0.74, 9.19, 'Set-2026', 1),
  ('imobiliario', 'BANCO BARI S.A.', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em IPCA', 1.15, 14.69, 'Set-2026', 2),
  ('imobiliario', 'BCO DAYCOVAL S.A', 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em IPCA', 1.21, 15.48, 'Set-2026', 3),
  ('imobiliario', 'CAIXA ECONOMICA FEDERAL', 'Financiamento imobiliário com taxas reguladas - Prefixado', 0.87, 10.94, 'Set-2026', 1),
  ('imobiliario', 'APE POUPEX', 'Financiamento imobiliário com taxas reguladas - Prefixado', 1.12, 14.27, 'Set-2026', 2),
  ('imobiliario', 'CAIXA ECONOMICA FEDERAL', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.64, 7.98, 'Set-2026', 1),
  ('imobiliario', 'BANCO INTER', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.77, 9.66, 'Set-2026', 2),
  ('imobiliario', 'BANCO SICOOB S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.8, 10.01, 'Set-2026', 3),
  ('imobiliario', 'BCO DO EST. DO PA S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.81, 10.21, 'Set-2026', 4),
  ('imobiliario', 'BCO DO ESTADO DO RS S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.82, 10.35, 'Set-2026', 5),
  ('imobiliario', 'BANCO COOPERATIVO SICREDI', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.84, 10.5, 'Set-2026', 6),
  ('imobiliario', 'BCO DO EST. DE SE S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.84, 10.54, 'Set-2026', 7),
  ('imobiliario', 'APE POUPEX', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.84, 10.61, 'Set-2026', 8),
  ('imobiliario', 'BCO DO BRASIL S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.84, 10.61, 'Set-2026', 9),
  ('imobiliario', 'BCO BANESTES S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.84, 10.62, 'Set-2026', 10),
  ('imobiliario', 'BRB - BCO DE BRASILIA S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.85, 10.65, 'Set-2026', 11),
  ('imobiliario', 'BCO BRADESCO S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.93, 11.77, 'Set-2026', 12),
  ('imobiliario', 'BCO SANTANDER (BRASIL) S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.94, 11.85, 'Set-2026', 13),
  ('imobiliario', 'ITAÚ UNIBANCO S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em TR', 0.94, 11.87, 'Set-2026', 14),
  ('imobiliario', 'CAIXA ECONOMICA FEDERAL', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em IPCA', 0.39, 4.84, 'Set-2026', 1),
  ('imobiliario', 'BCO DO EST. DO PA S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em IPCA', 0.5, 6.18, 'Set-2026', 2),
  ('imobiliario', 'BANCO SICOOB S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em IPCA', 0.71, 8.85, 'Set-2026', 3),
  ('imobiliario', 'BCO DO BRASIL S.A.', 'Financiamento imobiliário com taxas reguladas - Pós-fixado referenciado em IPCA', 0.88, 11.03, 'Set-2026', 4),
  ('veiculo', 'BCO MERCEDES-BENZ S.A.', 'Aquisição de veículos - Prefixado', 0.62, 7.65, '2026-10-09 a 2026-10-16', 1),
  ('veiculo', 'BMW SA CFI', 'Aquisição de veículos - Prefixado', 0.92, 11.62, '2026-10-09 a 2026-10-16', 2),
  ('veiculo', 'CAIXA ECONOMICA FEDERAL', 'Aquisição de veículos - Prefixado', 1.01, 12.76, '2026-10-09 a 2026-10-16', 3),
  ('veiculo', 'BCO RCI BRASIL S.A.', 'Aquisição de veículos - Prefixado', 1.04, 13.26, '2026-10-09 a 2026-10-16', 4),
  ('veiculo', 'BCO DO BRASIL S.A.', 'Aquisição de veículos - Prefixado', 1.08, 13.7, '2026-10-09 a 2026-10-16', 5),
  ('veiculo', 'BCO DA AMAZONIA S.A.', 'Aquisição de veículos - Prefixado', 1.08, 13.77, '2026-10-09 a 2026-10-16', 6),
  ('veiculo', 'BANCO HYUNDAI CAPITAL BRASIL', 'Aquisição de veículos - Prefixado', 1.2, 15.36, '2026-10-09 a 2026-10-16', 7),
  ('veiculo', 'BCO GM S.A.', 'Aquisição de veículos - Prefixado', 1.41, 18.25, '2026-10-09 a 2026-10-16', 8),
  ('veiculo', 'BANCO TRATON BRASIL S.A.', 'Aquisição de veículos - Prefixado', 1.44, 18.67, '2026-10-09 a 2026-10-16', 9),
  ('veiculo', 'STELLANTIS FINANCIAMENTOS CFI', 'Aquisição de veículos - Prefixado', 1.6, 20.96, '2026-10-09 a 2026-10-16', 10),
  ('veiculo', 'BCO BRADESCO S.A.', 'Aquisição de veículos - Prefixado', 1.61, 21.1, '2026-10-09 a 2026-10-16', 11),
  ('veiculo', 'SINOSSERRA S/A - SCFI', 'Aquisição de veículos - Prefixado', 1.63, 21.41, '2026-10-09 a 2026-10-16', 12),
  ('veiculo', 'SAFRA SCFI S.A.', 'Aquisição de veículos - Prefixado', 1.63, 21.41, '2026-10-09 a 2026-10-16', 13),
  ('veiculo', 'BANCO INTER', 'Aquisição de veículos - Prefixado', 1.63, 21.43, '2026-10-09 a 2026-10-16', 14),
  ('veiculo', 'BCO RODOBENS S.A.', 'Aquisição de veículos - Prefixado', 1.64, 21.51, '2026-10-09 a 2026-10-16', 15),
  ('veiculo', 'BCO DO EST. DO PA S.A.', 'Aquisição de veículos - Prefixado', 1.64, 21.61, '2026-10-09 a 2026-10-16', 16),
  ('veiculo', 'BCO VOLKSWAGEN S.A', 'Aquisição de veículos - Prefixado', 1.67, 21.98, '2026-10-09 a 2026-10-16', 17),
  ('veiculo', 'BANCO MONEO S.A.', 'Aquisição de veículos - Prefixado', 1.73, 22.82, '2026-10-09 a 2026-10-16', 18),
  ('veiculo', 'BCO TOYOTA DO BRASIL S.A.', 'Aquisição de veículos - Prefixado', 1.78, 23.63, '2026-10-09 a 2026-10-16', 19),
  ('veiculo', 'BCO DO ESTADO DO RS S.A.', 'Aquisição de veículos - Prefixado', 1.82, 24.14, '2026-10-09 a 2026-10-16', 20),
  ('veiculo', 'SANTANDER SCFI S.A.', 'Aquisição de veículos - Prefixado', 1.85, 24.57, '2026-10-09 a 2026-10-16', 21),
  ('veiculo', 'BCO BANESTES S.A.', 'Aquisição de veículos - Prefixado', 1.89, 25.14, '2026-10-09 a 2026-10-16', 22),
  ('veiculo', 'ITAÚ UNIBANCO HOLDING S.A.', 'Aquisição de veículos - Prefixado', 1.94, 25.96, '2026-10-09 a 2026-10-16', 23),
  ('veiculo', 'BCO C6 S.A.', 'Aquisição de veículos - Prefixado', 1.95, 26.07, '2026-10-09 a 2026-10-16', 24),
  ('veiculo', 'BCO BRASILEIRO DE CRÉDITO S.A.', 'Aquisição de veículos - Prefixado', 1.97, 26.32, '2026-10-09 a 2026-10-16', 25),
  ('veiculo', 'BCO BRADESCO FINANC. S.A.', 'Aquisição de veículos - Prefixado', 1.98, 26.54, '2026-10-09 a 2026-10-16', 26),
  ('veiculo', 'PORTOSEG S.A. CFI', 'Aquisição de veículos - Prefixado', 1.99, 26.7, '2026-10-09 a 2026-10-16', 27),
  ('veiculo', 'BANCO CNH INDUSTRIAL CAPITAL S.A', 'Aquisição de veículos - Prefixado', 2.01, 27.01, '2026-10-09 a 2026-10-16', 28),
  ('veiculo', 'BCO VOTORANTIM S.A.', 'Aquisição de veículos - Prefixado', 2.11, 28.54, '2026-10-09 a 2026-10-16', 29),
  ('veiculo', 'BCO HONDA S.A.', 'Aquisição de veículos - Prefixado', 2.47, 34.0, '2026-10-09 a 2026-10-16', 30),
  ('veiculo', 'OMNI BANCO S.A.', 'Aquisição de veículos - Prefixado', 2.49, 34.27, '2026-10-09 a 2026-10-16', 31),
  ('veiculo', 'BCO YAMAHA MOTOR S.A.', 'Aquisição de veículos - Prefixado', 2.66, 37.02, '2026-10-09 a 2026-10-16', 32),
  ('veiculo', 'BANCO PAN', 'Aquisição de veículos - Prefixado', 2.85, 40.12, '2026-10-09 a 2026-10-16', 33),
  ('veiculo', 'AGORACRED S/A SCFI', 'Aquisição de veículos - Prefixado', 2.87, 40.46, '2026-10-09 a 2026-10-16', 34),
  ('veiculo', 'FINAMAX S.A. CFI', 'Aquisição de veículos - Prefixado', 3.01, 42.77, '2026-10-09 a 2026-10-16', 35),
  ('veiculo', 'BCO DAYCOVAL S.A', 'Aquisição de veículos - Prefixado', 3.25, 46.77, '2026-10-09 a 2026-10-16', 36),
  ('veiculo', 'OMNI SA CFI', 'Aquisição de veículos - Prefixado', 3.4, 49.42, '2026-10-09 a 2026-10-16', 37)
) AS v(category, institution, modality, monthly_rate, annual_rate, reference_period, position)
WHERE NOT EXISTS (SELECT 1 FROM public.rate_references);
