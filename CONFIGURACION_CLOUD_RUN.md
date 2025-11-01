# ⚙️ Configuración Recomendada para Cloud Run

## Variables de Entorno (Obligatorias)

Después del primer deploy, agrega estas variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NODE_ENV` | `production` | **OBLIGATORIO** - Indica modo producción |
| `NEXT_PUBLIC_APP_URL` | `https://bancamia-dataexpress-test-848620556467.southamerica-east1.run.app` | URL pública de tu app |
| `DEV_ADMIN_TOKEN` | `tu-token-secreto-aqui` | Token para acceso admin sin IAP (opcional) |

## Variables de Entorno (Opcionales - Después de IAP)

| Variable | Valor | Cuándo |
|----------|-------|--------|
| `IAP_AUDIENCE` | `/projects/TU_PROJECT_NUMBER/apps/bancamia-dataexpress-test-00001-b5f` | Después de habilitar IAP |

## Configuración de Recursos

| Parámetro | Mínimo | Recomendado | Actual |
|-----------|--------|------------|--------|
| **Memoria** | 512 MiB | **1 GiB** | 512 MiB ⚠️ |
| **CPU** | 1 | 1 | 1 ✅ |
| **Simultaneidad** | 1 | **10-20** | 80 ⚠️ |
| **Timeout** | 300s | 300s | 300s ✅ |
| **Máx. Instancias** | 1 | 10-20 | 20 ✅ |

## Comandos para Actualizar (Alternativa CLI)

Si prefieres usar la consola, puedes actualizar después con:

```bash
# Actualizar variables de entorno
gcloud run services update bancamia-dataexpress-test-00001-b5f \
  --region=southamerica-east1 \
  --set-env-vars="NODE_ENV=production,NEXT_PUBLIC_APP_URL=https://bancamia-dataexpress-test-848620556467.southamerica-east1.run.app,DEV_ADMIN_TOKEN=tu-token-secreto"

# Actualizar memoria y simultaneidad
gcloud run services update bancamia-dataexpress-test-00001-b5f \
  --region=southamerica-east1 \
  --memory=1Gi \
  --concurrency=10 \
  --cpu=1
```

## Verificación Post-Deploy

1. ✅ La aplicación debe estar accesible en la URL proporcionada
2. ✅ El formulario público debe funcionar
3. ✅ El área `/admin` debe requerir autenticación
4. ⚠️ Si hay errores, revisa los logs en Cloud Run

