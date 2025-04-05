
interface StatusIndicatorProps {
  subtitleText: string;
  isProcessing: boolean;
}

const StatusIndicator = ({ subtitleText, isProcessing }: StatusIndicatorProps) => {
  return (
    <>
      {subtitleText && subtitleText !== 'Tap the mic to start talking with me' && (
        <div className="text-center text-sm text-blue-300 animate-pulse">
          {subtitleText}
        </div>
      )}

      {isProcessing && (
        <div className="text-center text-blue-300 text-sm">
          <span className="animate-pulse">Grand AI is thinking...</span>
        </div>
      )}
    </>
  );
};

export default StatusIndicator;
