package com.piyush.aios.ai_os.ai;

import org.springframework.stereotype.Component;

@Component
public class IntentDetector {

    public Intent detectIntent(String prompt) {

        String text = prompt.toLowerCase();

        if (text.contains("goal")) {

            if (text.contains("show")
                    || text.contains("list")
                    || text.contains("pending")) {

                return Intent.SHOW_GOALS;
            }

            if (text.contains("create")
                    || text.contains("add")) {

                return Intent.CREATE_GOAL;
            }

            if (text.contains("delete")
                    || text.contains("remove")) {

                return Intent.DELETE_GOAL;
            }

        }

        return Intent.GENERAL;
    }
}