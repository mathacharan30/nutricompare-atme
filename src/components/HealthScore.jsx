import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

/**
 * HealthScore Component
 *
 * Calculates and displays a health score based on juice nutrition values.
 *
 * @param {Object} props.nutrition - Object containing nutrition values
 * @param {number} props.nutrition.sugar_g - Sugar content in grams
 * @param {number} props.nutrition.calories_kcal - Calories in kcal
 * @param {number} props.nutrition.vitamin_c_mg - Vitamin C content in mg
 * @param {boolean} props.nutrition.has_preservatives - Whether the juice has preservatives
 */
const HealthScore = ({ nutrition }) => {
  const { t } = useTranslation();

  // Default to 0 if nutrition is not provided
  if (!nutrition) {
    return (
      <ScoreContainer>
        <ScoreTitle>{t('results.health_score')}</ScoreTitle>
        <ScoreValue>{t('results.na')}</ScoreValue>
        <ScoreMessage>Nutrition data not available</ScoreMessage>
      </ScoreContainer>
    );
  }

  // Calculate health score
  const calculateHealthScore = (nutrition) => {
    let score = 100;

    // Sugar penalty: subtract 2 points per gram over 15g
    if (nutrition.sugar_g > 15) {
      score -= (nutrition.sugar_g - 15) * 2;
    }

    // Calorie penalty: subtract 0.5 points per kcal over 100
    if (nutrition.calories_kcal > 100) {
      score -= (nutrition.calories_kcal - 100) * 0.5;
    }

    // Vitamin C bonus/penalty
    if (nutrition.vitamin_c_mg >= 50) {
      score += 5; // Bonus for high vitamin C
    } else if (nutrition.vitamin_c_mg < 20) {
      score -= 5; // Penalty for low vitamin C
    }

    // Preservative penalty
    if (nutrition.has_preservatives) {
      score -= 10;
    }

    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const score = calculateHealthScore(nutrition);

  // Determine score category and color
  const getScoreCategory = (score) => {
    if (score >= 90) return { category: t('results.excellent'), color: 'var(--score-excellent)', emoji: '🟢' };
    if (score >= 70) return { category: t('results.good'), color: 'var(--score-good)', emoji: '🟡' };
    return { category: t('results.poor'), color: 'var(--score-poor)', emoji: '🔴' };
  };

  const { category, color, emoji } = getScoreCategory(score);

  // Generate tooltip content explaining the score
  const generateTooltipContent = () => {
    const factors = [];

    if (nutrition.sugar_g > 15) {
      factors.push(t('health_score.tooltip.sugar_penalty', {
        value: nutrition.sugar_g,
        points: (nutrition.sugar_g - 15) * 2
      }));
    }

    if (nutrition.calories_kcal > 100) {
      factors.push(t('health_score.tooltip.calorie_penalty', {
        value: nutrition.calories_kcal,
        points: (nutrition.calories_kcal - 100) * 0.5
      }));
    }

    if (nutrition.vitamin_c_mg >= 50) {
      factors.push(t('health_score.tooltip.vitamin_c_bonus', {
        value: nutrition.vitamin_c_mg
      }));
    } else if (nutrition.vitamin_c_mg < 20) {
      factors.push(t('health_score.tooltip.vitamin_c_penalty', {
        value: nutrition.vitamin_c_mg
      }));
    }

    if (nutrition.has_preservatives) {
      factors.push(t('health_score.tooltip.preservatives_penalty'));
    }

    return factors.join('\\n');
  };

  return (
    <ScoreContainer>
      <ScoreHeader>
        <ScoreTitle>{t('results.health_score')}</ScoreTitle>
        <Tooltip title={generateTooltipContent()}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </Tooltip>
      </ScoreHeader>

      <ScoreDisplay color={color}>
        <ScoreValue>{score}</ScoreValue>
        <ScoreMax>/100</ScoreMax>
      </ScoreDisplay>

      <ProgressBarContainer>
        <ProgressBar value={score} max="100" color={color} />
        <ProgressBarLabel>{score}%</ProgressBarLabel>
      </ProgressBarContainer>

      <ScoreBadge color={color}>
        {emoji} {category}
      </ScoreBadge>

      <ScoreBreakdown>
        <BreakdownItem>
          <BreakdownLabel>{t('results.sugar')}:</BreakdownLabel>
          <BreakdownValue>{nutrition.sugar_g}g</BreakdownValue>
        </BreakdownItem>
        <BreakdownItem>
          <BreakdownLabel>{t('results.calories')}:</BreakdownLabel>
          <BreakdownValue>{nutrition.calories_kcal}kcal</BreakdownValue>
        </BreakdownItem>
        <BreakdownItem>
          <BreakdownLabel>{t('results.vitamin_c')}:</BreakdownLabel>
          <BreakdownValue>{nutrition.vitamin_c_mg}mg</BreakdownValue>
        </BreakdownItem>
        <BreakdownItem>
          <BreakdownLabel>{t('results.preservatives')}:</BreakdownLabel>
          <BreakdownValue>{nutrition.has_preservatives ? t('results.yes') : t('results.no')}</BreakdownValue>
        </BreakdownItem>
      </ScoreBreakdown>
    </ScoreContainer>
  );
};

// Styled Components
const ScoreContainer = styled.div`
  background-color: var(--bg-white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(122, 37, 124, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(122, 37, 124, 0.15);
  }
`;

const ScoreHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const ScoreTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-dark);
`;

const Tooltip = styled.div`
  position: relative;
  cursor: help;
  color: var(--text-medium);

  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 125%;
    right: 0;
    width: 250px;
    padding: 10px;
    border-radius: 6px;
    background-color: var(--primary-dark);
    color: white;
    font-size: 0.8rem;
    z-index: 100;
    white-space: pre-line;
    box-shadow: 0 4px 15px rgba(122, 37, 124, 0.2);
  }
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 15px;
  color: ${props => props.color};
`;

const ScoreValue = styled.span`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
`;

const ScoreMax = styled.span`
  font-size: 1.2rem;
  margin-left: 5px;
  opacity: 0.7;
`;

const ProgressBarContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const ProgressBar = styled.progress`
  width: 100%;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;

  &::-webkit-progress-bar {
    background-color: var(--bg-light);
    border-radius: 6px;
  }

  &::-webkit-progress-value {
    background-color: ${props => props.color};
    border-radius: 6px;
    transition: width 0.5s ease;
  }

  &::-moz-progress-bar {
    background-color: ${props => props.color};
    border-radius: 6px;
    transition: width 0.5s ease;
  }
`;

const ProgressBarLabel = styled.span`
  position: absolute;
  top: -20px;
  right: 0;
  font-size: 0.8rem;
  color: var(--text-medium);
`;

const ScoreBadge = styled.div`
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  background-color: ${props => props.color};
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const ScoreMessage = styled.p`
  color: var(--text-medium);
  font-style: italic;
  margin: 10px 0;
`;

const ScoreBreakdown = styled.div`
  margin-top: 20px;
  border-top: 1px solid var(--bg-light);
  padding-top: 15px;
`;

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const BreakdownLabel = styled.span`
  color: var(--text-medium);
  font-size: 0.9rem;
`;

const BreakdownValue = styled.span`
  color: var(--text-dark);
  font-weight: 600;
  font-size: 0.9rem;
`;

export default HealthScore;
