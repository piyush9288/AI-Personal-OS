package com.piyush.aios.ai_os.ai;

import org.springframework.stereotype.Component;

@Component
public class IntentDetector {

    public Intent detectIntent(String prompt) {

        String text = prompt.toLowerCase();

        if (text.matches(".*(?:delete|remove).*task.*")) {
            return Intent.DELETE_TASK;
        }

        if (text.matches(".*(?:delete|remove).*goal.*")) {
            return Intent.DELETE_GOAL;
        }

        if (text.matches(".*(?:complete|done|finished).*task.*")) {
            return Intent.COMPLETE_TASK;
        }

        if (text.matches(".*(?:show|list|pending).*task.*")) {
            return Intent.SHOW_TASKS;
        }

        if (text.matches(".*(?:show|list|pending).*goal.*")) {
            return Intent.SHOW_GOALS;
        }

        if (text.matches(".*(?:create|add).*task.*")) {
            return Intent.CREATE_TASK;
        }

        if (text.matches(".*(?:create|add).*goal.*")) {
            return Intent.CREATE_GOAL;
        }

        if (text.contains("complete") || text.contains("done") || text.contains("finished")) {
            if (text.contains("it")) {
                return Intent.COMPLETE_TASK;
            }
        }

        if (text.contains("dashboard")
                || text.contains("progress")
                || text.contains("how am i doing")
                || text.contains("statistics")
                || text.contains("summary")) {

            return Intent.DASHBOARD;
        }

        return Intent.GENERAL;
    }
}