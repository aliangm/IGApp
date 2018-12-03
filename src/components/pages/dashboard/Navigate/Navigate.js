import React from 'react'
import Component from 'components/Component'
import PathChart from 'components/pages/dashboard/Navigate/PathChart'
import style from 'styles/dashboard/navigate.css'
import dashboardStyle from 'styles/dashboard/dashboard.css'
import { getChannelsWithProps } from 'components/utils/channels'

const formatForecastedIndicators = (forecastedIndicators) => forecastedIndicators.map((month) =>
	Object.keys(month).reduce((res, key) => ({
		...res,
		[key]: month[key].committed,
	}), { })
)

const formatObjectives = (objectives) =>
	objectives
		.filter((obj) => Object.keys(obj).length > 0)
		.map((obj) => {
			const name = Object.keys(obj)[0]
			const data = obj[name]

			return {
				name,
				target: data.target.value,
			}
		})

export default class Navigate extends Component {
	style = style
	styles = [dashboardStyle]

	// mock channels
	get channels() {
		return Object.keys(getChannelsWithProps()).map(channel => ({
			key: channel,
			score: Math.random() + 1, // from 1 to 2
			icon: 'plan:' + channel
		}))
	}

	// channel tooltip just for example
	renderChannelTooltip = (channel) => (
		<div className={this.classes.channelTooltip}>
			<div className={this.classes.channelTooltipHeader}>{channel}</div>
		</div>
	)

	render() {
		return (
			<div className={this.classes.container}>
				<div className={dashboardStyle.locals.wrap}>🚧</div>
				<PathChart
					data={{
						future: formatForecastedIndicators(this.props.forecastedIndicators),
						past: this.props.historyData.indicators,
					}}
					channels={{
						future: this.channels.slice(0, 5),
						past: this.channels.slice(5, 10),
						present: this.channels.slice(10, 15),
					}}
					tooltip={{
						future: this.renderChannelTooltip,
						past: this.renderChannelTooltip,
						present: this.renderChannelTooltip,
					}}
					objectives={formatObjectives(this.props.objectives)}
					maxMonths={this.props.historyData.indicators.length}
				/>
			</div>
		)
	}
}
