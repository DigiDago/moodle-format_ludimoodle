// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope this it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Game profile.
 *
 * @module      format_ludimoodle/gameprofile
 * @package     format_ludimoodle
 * @copyright   2024 Pimenko <support@pimenko.com><pimenko.com>
 * @author      Jordan Kesraoui
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['jquery', 'core/str', 'core/log', 'https://cdn.jsdelivr.net/npm/chart.js'], function($, str, log, Chart) {
    return {
        init: function(hexadscores) {
            $(document).ready(function() {
                // Load the translated strings
                str.get_strings([
                    {key: 'achiever', component: 'format_ludimoodle'},
                    {key: 'player', component: 'format_ludimoodle'},
                    {key: 'socialiser', component: 'format_ludimoodle'},
                    {key: 'freeSpirit', component: 'format_ludimoodle'},
                    {key: 'disruptor', component: 'format_ludimoodle'},
                    {key: 'philanthropist', component: 'format_ludimoodle'},
                    {key: 'achiever_desc', component: 'format_ludimoodle'},
                    {key: 'player_desc', component: 'format_ludimoodle'},
                    {key: 'socialiser_desc', component: 'format_ludimoodle'},
                    {key: 'freeSpirit_desc', component: 'format_ludimoodle'},
                    {key: 'disruptor_desc', component: 'format_ludimoodle'},
                    {key: 'philanthropist_desc', component: 'format_ludimoodle'}
                ]).done(function(strings) {
                    const labels = strings.slice(0, 6).map(function(string) {
                        return string;
                    });

                    const explanations = strings.slice(6).map(function(string) {
                        return string;
                    });

                    const ctx = document.getElementById('hexadChart').getContext('2d');
                    const hexadChart = new Chart(ctx, {
                        type: 'radar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Hexad Scores',
                                data: [
                                    hexadscores.achiever,
                                    hexadscores.player,
                                    hexadscores.socialiser,
                                    hexadscores.freeSpirit,
                                    hexadscores.disruptor,
                                    hexadscores.philanthropist
                                ],
                                fill: true,
                                backgroundColor: 'rgba(85, 85, 255, 0.5)',
                                borderColor: 'transparent',
                                pointBackgroundColor: 'transparent',
                                pointBorderColor: 'transparent',
                                pointHoverBackgroundColor: 'transparent',
                                pointHoverBorderColor: 'transparent',
                                pointHitRadius: 50,
                            }]
                        },
                        options: {
                            scales: {
                                r: {
                                    suggestedMin: 0,
                                    suggestedMax: 14,
                                    angleLines: {
                                        display: false // Hide angle lines
                                    },
                                    grid: {
                                        color: 'rgba(200, 200, 200, 0.8)' // Light grid lines
                                    },
                                    pointLabels: {
                                        font: {
                                            size: 20,
                                            family: 'Arial, sans-serif',
                                            style: 'normal',
                                            lineHeight: 1.2
                                        },
                                        color: '#666' // Label color
                                    },
                                    ticks: {
                                        display: false // Hide the scale numbers
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false // Hide the legend
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            return explanations[context.dataIndex];
                                        }
                                    }
                                }
                            }
                        }
                    });
                }).fail(function() {
                    log.error('Failed to load strings for hexad chart labels.');
                });
            });
        }
    };
});