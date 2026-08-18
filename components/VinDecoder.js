import { useState } from 'react';
import { decodeVin } from '../lib/vinDecoder';
import { TRIMS } from '../data/trims';

// onDecode receives a partial patch of VehicleSelector's value shape
// (year/make/model/segment) to merge into the parent's state.
export default function VinDecoder({ onDecode }) {
  const [vin, setVin] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [message, setMessage] = useState('');
  const [info, setInfo] = useState(null);

  async function handleDecode() {
    setStatus('loading');
    setMessage('');
    setInfo(null);

    try {
      const result = await decodeVin(vin);
      if (result.error) {
        setStatus('error');
        setMessage(result.error);
        return;
      }
      onDecode(result.patch);
      setInfo(result.info);
      setMessage(result.yearNote || '');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setMessage('Lookup failed — check your connection and try again.');
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-steel/20 bg-paper p-4">
      <label className="mb-1 block text-sm font-medium text-steel">Decode a VIN (optional)</label>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          maxLength={17}
          placeholder="17-character VIN"
          className="font-mono-num w-full flex-1 rounded-md border border-steel/30 bg-white px-3 py-2 uppercase sm:w-auto"
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
        />
        <button
          type="button"
          onClick={handleDecode}
          disabled={status === 'loading' || vin.trim().length === 0}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-50"
        >
          {status === 'loading' ? 'Decoding…' : 'Decode VIN'}
        </button>
      </div>
      <p className="mt-1 text-xs text-steel">
        Looked up via NHTSA&apos;s free public VIN decoder. Fills in year, make, model, and a
        best-guess trim level below — mileage isn&apos;t part of a VIN, so enter that yourself.
      </p>

      {status === 'error' && <p className="mt-2 text-sm font-medium text-rust">{message}</p>}

      {status === 'success' && info && (
        <div className="mt-3 rounded-md bg-white p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-moss">
              Decoded: {info.year || '—'} {info.make} {info.model}
            </p>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`VIN ${vin.trim().toUpperCase()} title history NMVTIS check`)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-teal underline underline-offset-2"
            >
              Check title/history →
            </a>
          </div>
          {message && <p className="mt-1 text-xs text-amber-700">{message}</p>}
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-steel sm:grid-cols-3">
            {info.trim && (
              <div className="col-span-2 sm:col-span-3">
                <dt className="inline font-medium">Trim: </dt>
                <dd className="inline">
                  {info.trim}
                  {info.trimGuess ? (
                    <span className="text-moss"> — set trim level to {TRIMS[info.trimGuess]?.label}</span>
                  ) : (
                    <span> — no confident match, trim level left unchanged</span>
                  )}
                </dd>
              </div>
            )}
            {info.bodyClass && (
              <div>
                <dt className="inline font-medium">Body: </dt>
                <dd className="inline">{info.bodyClass}</dd>
              </div>
            )}
            {info.driveType && (
              <div>
                <dt className="inline font-medium">Drive: </dt>
                <dd className="inline">{info.driveType}</dd>
              </div>
            )}
            {info.engineCylinders && (
              <div>
                <dt className="inline font-medium">Cylinders: </dt>
                <dd className="inline">{info.engineCylinders}</dd>
              </div>
            )}
            {info.fuelType && (
              <div>
                <dt className="inline font-medium">Fuel: </dt>
                <dd className="inline">{info.fuelType}</dd>
              </div>
            )}
            {info.plantCountry && (
              <div>
                <dt className="inline font-medium">Built in: </dt>
                <dd className="inline">{info.plantCountry}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
