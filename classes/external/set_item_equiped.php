<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

namespace format_ludimoodle\external;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/externallib.php');

use context_course;
use external_api;
use external_function_parameters;
use external_single_structure;
use external_value;
use format_ludimoodle\local\gameelements\game_element;
use format_ludimoodle\manager;

/**
 * Class for get inventory.
 *
 * @package     format_ludimoodle
 * @copyright   2024 Pimenko <support@pimenko.com><pimenko.com>
 * @author      Jordan Kesraoui
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class set_item_equiped extends external_api {

    /**
     * Execute the webservice.
     *
     * @param int $courseid Id of the course.
     * @param int $slot Slot of the item.
     * @param int $theme Theme of the item.
     * @return array The web service return.
     */
    public static function execute(int $courseid, int $slot, int $theme): array {
        global $DB, $USER, $CFG;

        $context = context_course::instance($courseid);
        self::validate_context($context);
        $manager = new manager();
        $gameelements = game_element::get_all($courseid, $USER->id);
        $success = true;

        $olditemid = null;
        foreach ($gameelements as $gameelement) {
            if ($gameelement->get_type() == 'avatar') {

                // Search old item equiped.
                if ($olditemid == null) {
                    $oldthemeequiped = $gameelement->get_item_equiped($slot);

                    // If old item equiped exist.
                    if ($oldthemeequiped > 0) {
                        $olditemid = $slot . '-' . $oldthemeequiped;
                    }
                }
                $success = $success && $manager->update_gameelement_user($gameelement->get_id(),
                    $USER->id, 'item-equiped-' . $slot, $theme);
            }
        }

        return [
            'success' => $success,
        ];
    }

    /**
     * Get webservice parameters structure.
     *
     * @return external_function_parameters The webservice parameters structure.
     */
    public static function execute_parameters(): external_function_parameters {
        $parameters = [
            'courseid' => new external_value(
                PARAM_INT,
                'Course ID',
                VALUE_REQUIRED
            ),
            'slot' => new external_value(
                PARAM_INT,
                'Slot',
                VALUE_REQUIRED
            ),
            'theme' => new external_value(
                PARAM_INT,
                'Theme',
                VALUE_REQUIRED
            ),
        ];
        return new external_function_parameters($parameters);
    }

    /**
     * Get webservice returns structure.
     *
     * @return external_single_structure The webservice returns structure.
     */
    public static function execute_returns(): external_single_structure {
        $keys = [
            'success' => new external_value(
                PARAM_BOOL,
                'Success'
            ),
        ];

        return new external_single_structure(
            $keys,
            'set_item_equiped'
        );
    }
}