CREATE OR REPLACE FUNCTION public.block_archived_contract_signing()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF OLD.status = 'arquivado'
     AND (NEW.client_signed_at IS DISTINCT FROM OLD.client_signed_at
          OR NEW.company_signed_at IS DISTINCT FROM OLD.company_signed_at) THEN
    RAISE EXCEPTION 'Este contrato foi arquivado e não pode mais ser assinado.';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS contracts_block_archived_signing ON public.contracts;
CREATE TRIGGER contracts_block_archived_signing
BEFORE UPDATE ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.block_archived_contract_signing();