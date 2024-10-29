export enum TimeDomainAnalysis {
  DC = "Dc",
  Pulse = "Pulse",
  Sine = "Sin",
  Exponential = "Exp",
  SingleFrequencyFM = "Sffm",
  AmplitudeModulated = "Am"
}

export enum TimeDomainAnalysisDisplay {
  Dc = "DC",
  Pulse = "Pulse",
  Sin = "Sinusoidal",
  Exp = "Exponential",
  Sffm = "Single Frequency FM",
  Am = "Amplitude Modulated"
}

export type TimeDomainParameters =
  | {
      [TimeDomainAnalysis.DC]: {
        value: string;
      };
    }
  | {
      [TimeDomainAnalysis.Pulse]: {
        initial_value: string;
        final_value: string;
        delay: string;
        rise_time: string;
        fall_time: string;
        pulse_width: string;
        period: string;
      };
    }
  | {
      [TimeDomainAnalysis.Sine]: {
        offset: string;
        amplitude: string;
        frequency: string;
        delay: string;
        damping_factor: string;
      };
    }
  | {
      [TimeDomainAnalysis.Exponential]: {
        initial_value: string;
        final_value: string;
        rise_delay: string;
        rise_time: string;
        fall_delay: string;
        fall_time: string;
      };
    }
  | {
      [TimeDomainAnalysis.SingleFrequencyFM]: {
        offset: string;
        amplitude: string;
        carrier_frequency: string;
        modulation_index: number;
        signal_frequency: string;
      };
    }
  | {
      [TimeDomainAnalysis.AmplitudeModulated]: {
        amplitude: string;
        offset: string;
        modulating_frequency: string;
        carrier_frequency: string;
        delay: string;
      };
    };

export type SmallsignalParameters = {
  amplitude: string;
  phase: string;
};
