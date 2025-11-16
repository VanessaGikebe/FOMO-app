'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseClient';

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState({
    currentUser: null,
    firebaseAuth: 'checking...',
    firebaseGetToken: 'pending',
    backendConnection: 'pending',
    googleDnsResolution: 'pending',
    results: [],
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results = [];
    const newDiag = { ...diagnostics };

    // 1. Check Firebase Auth status
    try {
      const user = auth.currentUser;
      if (user) {
        newDiag.currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };
        results.push(`✅ Firebase Auth: User logged in as ${user.email}`);
        newDiag.firebaseAuth = 'logged in';

        // 2. Try to get token
        try {
          console.log('Attempting to get token without refresh...');
          const token = await user.getIdToken(false);
          results.push(`✅ Got cached token (no refresh): ${token.substring(0, 20)}...`);
          newDiag.firebaseGetToken = 'success (cached)';
        } catch (err) {
          results.push(`❌ Failed to get cached token: ${err.message}`);
          newDiag.firebaseGetToken = `failed: ${err.code}`;

          // Try with refresh
          try {
            console.log('Attempting to get token WITH refresh...');
            const tokenRefreshed = await user.getIdToken(true);
            results.push(`✅ Got token with refresh: ${tokenRefreshed.substring(0, 20)}...`);
            newDiag.firebaseGetToken = 'success (refreshed)';
          } catch (refreshErr) {
            results.push(`❌ Failed to get token with refresh: ${refreshErr.message}`);
            results.push(`   Error code: ${refreshErr.code}`);
            results.push(`   Error name: ${refreshErr.name}`);
            newDiag.firebaseGetToken = `failed with refresh: ${refreshErr.code}`;
          }
        }
      } else {
        newDiag.firebaseAuth = 'no user logged in';
        results.push('⚠️ Firebase Auth: No user logged in. Please sign in first.');
      }
    } catch (err) {
      newDiag.firebaseAuth = 'error';
      results.push(`❌ Firebase Auth error: ${err.message}`);
    }

    // 3. Test backend connection
    try {
      const response = await fetch('http://localhost:3002/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const text = await response.text();
        newDiag.backendConnection = 'connected';
        results.push(`✅ Backend: Responding (${text})`);
      } else {
        newDiag.backendConnection = `http error ${response.status}`;
        results.push(`⚠️ Backend: HTTP ${response.status}`);
      }
    } catch (err) {
      newDiag.backendConnection = 'connection failed';
      results.push(`❌ Backend: ${err.message}`);
    }

    // 4. Test Google DNS/services
    try {
      const response = await fetch('https://dns.google/resolve?name=firestore.googleapis.com', {
        method: 'GET',
      }).catch(err => {
        // This will likely fail, but let's try a simpler test
        return fetch('https://www.google.com/', { method: 'HEAD' }).catch(err2 => ({ ok: false, error: err2.message }));
      });
      
      if (response && response.ok) {
        newDiag.googleDnsResolution = 'reachable';
        results.push('✅ Google services: Reachable');
      } else {
        newDiag.googleDnsResolution = 'unreachable';
        results.push('❌ Google services: Unreachable (possible firewall/network block)');
      }
    } catch (err) {
      newDiag.googleDnsResolution = 'error';
      results.push(`❌ Google services test: ${err.message}`);
    }

    results.push('');
    results.push('--- RECOMMENDATIONS ---');
    if (newDiag.firebaseGetToken.includes('network-request-failed') || newDiag.googleDnsResolution === 'unreachable') {
      results.push('🔴 Issue: Firebase cannot reach Google servers');
      results.push('  Check:');
      results.push('    1. Is your internet working? (Try google.com in browser)');
      results.push('    2. Is there a firewall blocking Google services?');
      results.push('    3. Are you behind a VPN or proxy?');
      results.push('    4. Try disabling VPN/firewall temporarily');
      results.push('    5. Restart your router/internet connection');
    } else if (!newDiag.currentUser) {
      results.push('⚠️ No user logged in. You need to sign in first.');
      results.push('  Click the Sign In button in Navbar to proceed.');
    } else {
      results.push('✅ All diagnostics passed!');
      results.push('  You should be able to create events.');
    }

    newDiag.results = results;
    setDiagnostics(newDiag);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>🔧 FOMO Diagnostics</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runDiagnostics}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Re-run Diagnostics
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
        <h2>Summary</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}><strong>Firebase Auth Status:</strong></td>
              <td style={{ padding: '8px' }}>{diagnostics.firebaseAuth}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}><strong>Get Token:</strong></td>
              <td style={{ padding: '8px' }}>{diagnostics.firebaseGetToken}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}><strong>Backend Connection:</strong></td>
              <td style={{ padding: '8px' }}>{diagnostics.backendConnection}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><strong>Google Services:</strong></td>
              <td style={{ padding: '8px' }}>{diagnostics.googleDnsResolution}</td>
            </tr>
          </tbody>
        </table>

        {diagnostics.currentUser && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            <strong>Logged in as:</strong> {diagnostics.currentUser.email}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px' }}>
        <h2>Detailed Results</h2>
        {diagnostics.results.map((line, i) => (
          <div key={i} style={{ 
            paddingBottom: '4px',
            color: line.startsWith('✅') ? '#2e7d32' : line.startsWith('❌') ? '#c62828' : line.startsWith('⚠️') ? '#f57f17' : line.startsWith('🔴') ? '#b71c1c' : '#000',
            fontWeight: line.startsWith('---') || line.startsWith('🔴') ? 'bold' : 'normal',
          }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
