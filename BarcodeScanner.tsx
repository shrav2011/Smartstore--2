import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Camera, CameraOff, Power, ShieldAlert, CheckCircle } from 'lucide-react';

const BarcodeScanner: React.FC = () => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'prompt' | 'denied'>('checking');
    const navigate = useNavigate();
    const { getProductByBarcode } = useProducts();

    const qrcodeRegionId = "qr-code-full-region";

    useEffect(() => {
        const checkCameraPermission = async () => {
            if (!navigator.permissions) {
                setPermissionStatus('prompt');
                return;
            }
            try {
                const status = await navigator.permissions.query({ name: 'camera' as any });
                setPermissionStatus(status.state);
                status.onchange = () => {
                    setPermissionStatus(status.state);
                };
            } catch (e) {
                console.error("Could not check camera permission:", e);
                setPermissionStatus('prompt');
            }
        };

        checkCameraPermission();
    }, []);

    useEffect(() => {
        if (isScanning && permissionStatus !== 'denied') {
            if (!document.getElementById(qrcodeRegionId)) return;

            const html5Qrcode = new Html5Qrcode(qrcodeRegionId);
            scannerRef.current = html5Qrcode;

            const onScanSuccess = (decodedText: string) => {
                if (html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING) {
                    setIsScanning(false);
                    setScanResult(decodedText);

                    const existingProduct = getProductByBarcode(decodedText);
                    if (existingProduct) {
                        navigate(`/edit-product/${existingProduct.id}`);
                    } else {
                        navigate('/add-product', { state: { barcode: decodedText } });
                    }
                }
            };

            const onScanFailure = (errorMessage: string) => { /* ignore */ };

            html5Qrcode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
                onScanSuccess,
                onScanFailure
            ).catch((err: any) => {
                console.error("Failed to start scanner", err);
                 if (err.name !== 'NotAllowedError') {
                   setError("Failed to start camera. It might be in use by another app.");
                }
                setIsScanning(false);
            });
        }

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(err => console.error("Failed to stop scanner on cleanup", err));
            }
        };
    }, [isScanning, getProductByBarcode, navigate, permissionStatus]);

    const handleStartClick = () => {
        setError(null);
        setScanResult(null);
        setIsScanning(true);
    };

    const handleStopClick = () => {
        setIsScanning(false);
    };
    
    const renderIdleContent = () => {
        if (permissionStatus === 'denied') {
            return (
                <div className="text-center p-4">
                    <ShieldAlert size={64} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">Camera Permission Denied</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">SmartStock needs camera access to scan barcodes. You have previously denied this permission.</p>
                    <div className="mt-4 text-xs text-left text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                        <p className="font-bold mb-1">How to grant permission:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Look for a camera icon in your browser's address bar.</li>
                            <li>Click it and select "Always allow...".</li>
                            <li>Or, go to Browser Settings → Privacy and Security → Site Settings → Camera and allow this site.</li>
                            <li>You may need to reload the page after changing settings.</li>
                        </ol>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-4">
                    <ShieldAlert size={64} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">Camera Error</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            );
        }

        if (scanResult) {
            return (
                 <div className="text-center">
                    <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">Scan successful!</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Redirecting...</p>
                </div>
            );
        }
        
        if (permissionStatus === 'checking') {
            return <div className="text-center text-gray-500 dark:text-gray-400">Checking camera permissions...</div>;
        }

        if (permissionStatus === 'granted') {
            return (
                <div className="text-center">
                    <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Camera Ready</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Click the button below to start scanning.</p>
                </div>
            );
        }

        return (
            <div className="text-center">
                <CameraOff size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Camera Access Needed</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please grant camera permission to scan barcodes.</p>
            </div>
        );
    };

    const getButtonText = () => {
        if (permissionStatus === 'denied') return 'Permission Denied';
        if (error) return 'Try Again';
        if (permissionStatus === 'prompt') return 'Allow Camera & Scan';
        return 'Start Scanning';
    };


    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Scan Barcode</h1>
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 min-h-[400px] flex flex-col justify-center items-center">
                {isScanning ? (
                    <div id={qrcodeRegionId} style={{ width: '100%' }}></div>
                ) : (
                    renderIdleContent()
                )}
            </div>
            <div className="mt-6 flex space-x-4">
                {!isScanning ? (
                    <button 
                        onClick={handleStartClick} 
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!!scanResult || permissionStatus === 'denied' || permissionStatus === 'checking'}
                    >
                        <Camera className="h-5 w-5 mr-2" />
                        {getButtonText()}
                    </button>
                ) : (
                    <button 
                        onClick={handleStopClick} 
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <Power className="h-5 w-5 mr-2" />
                        Stop Scanning
                    </button>
                )}
            </div>
            {!isScanning && !error && !scanResult && permissionStatus !== 'denied' && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Position a barcode inside the frame.</p>
            )}
        </div>
    );
};

export default BarcodeScanner;