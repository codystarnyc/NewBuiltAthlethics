/**
 * Fitness On Demand (fod247.io) connectivity check.
 * Loads .env — see .env.example for REACT_APP_FITNESS_* variables.
 *
 * Management API: POST {managementUrl}/Auth/Token (or /auth/token) with { clientId, clientSecret }
 * Flex API (per user): POST {flexUrl}/auth/token (or /Auth/Token) with { clientId, clientSecret, email }
 */
import 'dotenv/config';
import axios from 'axios';

const flexUrl = (process.env.REACT_APP_FITNESS_OD_URL ?? '').replace(/\/$/, '');
const managementUrl = (process.env.REACT_APP_FITNESS_OD_MURL ?? '').replace(/\/$/, '');
const clientId = process.env.REACT_APP_FITNESS_OD_CLIENT_ID ?? '';
const clientSecret = process.env.REACT_APP_FITNESS_OD_CLIENT_SECRET ?? '';
const adminEmail = process.env.REACT_APP_FITNESS_ADMIN_EMAIL ?? '';

async function tryManagementAuth(baseUrl: string, label: string): Promise<boolean> {
  const paths = ['/auth/token', '/Auth/Token'];
  for (const p of paths) {
    const url = `${baseUrl}${p}`;
    try {
      const { status, data } = await axios.post(
        url,
        { clientId, clientSecret },
        {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          validateStatus: () => true,
          timeout: 20_000,
        },
      );

      if (status === 200 && data && typeof data.idToken === 'string' && data.idToken.length > 0) {
        console.log(`[OK] ${label}: authenticated`);
        console.log(`     POST ${url}`);
        console.log(`     idToken (preview): ${data.idToken.slice(0, 28)}...`);
        if (data.message) console.log(`     message: ${data.message}`);
        return true;
      }

      console.log(`[FAIL] ${label}: HTTP ${status} @ ${url}`);
      console.log(`       body: ${JSON.stringify(data).slice(0, 400)}`);
    } catch (e) {
      console.log(`[FAIL] ${label}: ${(e as Error).message} @ ${url}`);
    }
  }
  return false;
}

async function tryFlexUserAuth(baseUrl: string, label: string, email: string): Promise<boolean> {
  if (!email) {
    console.log(`[SKIP] ${label}: set REACT_APP_FITNESS_ADMIN_EMAIL (or any FLEX-invited user email)`);
    return false;
  }
  const paths = ['/auth/token', '/Auth/Token'];
  const body = { clientId, clientSecret, email };

  for (const p of paths) {
    const url = `${baseUrl}${p}`;
    try {
      const { status, data } = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        validateStatus: () => true,
        timeout: 20_000,
      });

      if (
        status === 200 &&
        data?.idToken &&
        data?.accountId &&
        data?.policyKey
      ) {
        console.log(`[OK] ${label}: flex session for ${email}`);
        console.log(`     POST ${url}`);
        console.log(`     accountId: ${data.accountId}`);
        console.log(`     idToken (preview): ${String(data.idToken).slice(0, 28)}...`);
        return true;
      }

      console.log(`[FAIL] ${label}: HTTP ${status} @ ${url}`);
      console.log(`       body: ${JSON.stringify(data).slice(0, 500)}`);
    } catch (e) {
      console.log(`[FAIL] ${label}: ${(e as Error).message} @ ${url}`);
    }
  }
  return false;
}

async function main() {
  console.log('Fitness On Demand connection test\n');
  if (!clientId || !clientSecret) {
    console.error('Missing REACT_APP_FITNESS_OD_CLIENT_ID or REACT_APP_FITNESS_OD_CLIENT_SECRET');
    process.exit(1);
  }
  console.log(`test email (env): ${adminEmail || '(not set — flex test will skip)'}`);
  console.log(`flexUrl: ${flexUrl || '(not set)'}`);
  console.log(`managementUrl: ${managementUrl || '(not set)'}\n`);

  let managementOk = false;
  if (managementUrl) {
    managementOk = await tryManagementAuth(managementUrl, 'Management API');
  } else {
    console.log('[SKIP] Management API: REACT_APP_FITNESS_OD_MURL not set');
  }

  if (flexUrl) {
    const flexOk = await tryFlexUserAuth(flexUrl, 'Flex API (user token)', adminEmail);
    if (!flexOk && managementOk) {
      console.log(
        '\nNote: Flex user auth failed but Management succeeded. Ensure the email is invited in FLEX, or use correct Flex base URL (usually .../flex/v1).',
      );
    }
  } else {
    console.log('[SKIP] Flex API: REACT_APP_FITNESS_OD_URL not set');
  }

  console.log('\nDone.');
  if (managementUrl && !managementOk) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
